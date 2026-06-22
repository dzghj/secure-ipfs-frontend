import { useState } from "react";

const FILE_TYPE_ICONS = {
  pdf:   "📄",
  image: "🖼️",
  video: "🎬",
  audio: "🎵",
  doc:   "📝",
  zip:   "📦",
};

function getFileIcon(type = "") {
  const t = type.toLowerCase();
  if (t.includes("pdf"))                                          return FILE_TYPE_ICONS.pdf;
  if (t.includes("image") || t.includes("png") || t.includes("jpg")) return FILE_TYPE_ICONS.image;
  if (t.includes("video"))                                        return FILE_TYPE_ICONS.video;
  if (t.includes("audio"))                                        return FILE_TYPE_ICONS.audio;
  if (t.includes("zip")  || t.includes("rar"))                   return FILE_TYPE_ICONS.zip;
  return FILE_TYPE_ICONS.doc;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
}

export default function FileCard({ file, token, nominees = [] }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  if (!file) return null;

  const fileName     = file.filename || file.name || "Untitled";
  const fileType     = file.type     || "Document";
  const cid          = file.cid      || null;
  const fileCategory = file.category || "Personal";
  const createdAt    = formatDate(file.createdAt || file.created_at || file.uploadedAt);

  // Protected if any full-access nominee exists (covers all files),
  // or a partial nominee covers this file's category, or legacy keyHolderList
  const isProtected = !!(
    nominees.some((n) => n.accessLevel === "full") ||
    nominees.some(
      (n) =>
        n.accessLevel === "partial" &&
        Array.isArray(n.allowedFolders) &&
        n.allowedFolders.includes(fileCategory)
    ) ||
    file.keyHolderList?.length ||
    file.protected
  );
  const icon = getFileIcon(fileType);

  const handleView = async () => {
    if (!file.id && !cid) return;
    setDownloading(true);
    setError("");

    const authToken = token || localStorage.getItem("token");
    const viewUrl = file.viewUrl
      || `${process.env.REACT_APP_API_BASE_URL}/api/file/${file.id}/view`;

    try {
      const res = await fetch(viewUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

        if (!res.ok) {
          // Try nominee flow: fetch encrypted bytes + encrypted symmetric key, then decrypt client-side
          const downloadRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/file/${file.id}/download-encrypted`, { headers: { Authorization: `Bearer ${authToken}` } });
          if (!downloadRes.ok) {
            const text = await downloadRes.text();
            throw new Error(`Server returned ${downloadRes.status}: ${text}`);
          }
          const downloadJson = await downloadRes.json();

          const keyRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/file/${file.id}/nominee-key`, { headers: { Authorization: `Bearer ${authToken}` } });
          if (!keyRes.ok) {
            const text = await keyRes.text();
            throw new Error(`Server returned ${keyRes.status}: ${text}`);
          }
          const keyJson = await keyRes.json();

          const encryptedFileB64 = downloadJson.data;
          const ivHex = downloadJson.iv;
          const authTagHex = downloadJson.authTag;
          const mimeType = downloadJson.mimeType || "application/octet-stream";
          const downloadName = downloadJson.filename || fileName;

          const encryptedKeyB64 = keyJson.encryptedKey;

          // Helper conversions
          const b64ToBuf = (b64) => {
            const bin = atob(b64);
            const buf = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
            return buf.buffer;
          };

          const hexToBytes = (hex) => {
            const len = hex.length / 2;
            const out = new Uint8Array(len);
            for (let i = 0; i < len; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
            return out;
          };

          // Import private key from localStorage (PEM)
          const privPem = localStorage.getItem("nomineePrivateKey");
          if (!privPem) throw new Error("No nominee private key found in localStorage (nomineePrivateKey)");

          const pemToArrayBuffer = (pem) => {
            const b64 = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
            const bin = atob(b64);
            const buf = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
            return buf.buffer;
          };

          const privKeyBuf = pemToArrayBuffer(privPem);
          const cryptoKey = await window.crypto.subtle.importKey(
            "pkcs8",
            privKeyBuf,
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ["decrypt"]
          );

          // Decrypt symmetric key
          const encryptedKeyBuf = b64ToBuf(encryptedKeyB64);
          const symKeyBuf = await window.crypto.subtle.decrypt({ name: "RSA-OAEP" }, cryptoKey, encryptedKeyBuf);

          // Import symmetric key for AES-GCM
          const aesKey = await window.crypto.subtle.importKey("raw", symKeyBuf, "AES-GCM", false, ["decrypt"]);

          // Prepare ciphertext + authTag appended
          const encFileBuf = b64ToBuf(encryptedFileB64);
          const authTag = hexToBytes(authTagHex);
          const ciphertext = new Uint8Array(encFileBuf.byteLength + authTag.byteLength);
          ciphertext.set(new Uint8Array(encFileBuf), 0);
          ciphertext.set(authTag, encFileBuf.byteLength);

          const iv = hexToBytes(ivHex);

          const plainBuf = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, aesKey, ciphertext.buffer);
          const blob = new Blob([plainBuf], { type: mimeType });

          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = objectUrl;
          a.download = downloadName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(objectUrl);
        } else {
          const json = await res.json();

          // Backend returns { data: "<base64>", mimeType: "image/jpeg", filename: "..." }
          const base64 = json.data;
          const mimeType = json.mimeType || "application/octet-stream";
          const downloadName = json.filename || fileName;

          // Decode base64 → binary → Blob
          const byteChars = atob(base64);
          const byteArray = new Uint8Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteArray[i] = byteChars.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: mimeType });

          // Trigger download with correct filename
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = objectUrl;
          a.download = downloadName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(objectUrl);
        }
    } catch (err) {
      console.error("Download failed:", err);
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-dark-card border border-dark-border rounded-xl px-5 py-4 hover:border-primary transition">
      {/* Icon */}
      <div className="text-3xl flex-shrink-0">{icon}</div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{fileName}</p>

        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          <p className="text-xs text-gray-400">{fileType}</p>

          {isProtected && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
              🔒 Nominee Protected
            </span>
          )}
        </div>

        {createdAt && (
          <p className="text-xs text-gray-500 mt-1">Added {createdAt}</p>
        )}
      </div>

      {/* View button */}
      {(cid || file.id) && (
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <button
            onClick={handleView}
            disabled={downloading}
            className="text-xs px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30 transition font-medium disabled:opacity-50"
          >
            {downloading ? "…" : "View"}
          </button>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      )}
    </div>
  );
}
