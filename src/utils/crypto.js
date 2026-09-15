// Client-side encryption for uploads.
//
// The file is encrypted with AES-256-GCM in the browser BEFORE it's sent, so
// plaintext never leaves the device. The per-file key is generated here and
// handed to the backend, which stores it (needed for nominee access and account
// recovery) — so this is "encrypted in transit and at rest", not zero-knowledge.
//
// Output formats match the backend's secure-share/crypto-utils.js:
//   key      → base64   (32 bytes, AES-256)
//   iv       → hex       (12 bytes)
//   authTag  → hex       (16 bytes, split off the end of the WebCrypto output)

const toHex = (buf) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

const toB64 = (buf) => {
  let s = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
};

/**
 * Encrypt a File/Blob for upload.
 * @returns {Promise<{ blob: Blob, encKey: string, encIv: string,
 *                     encAuthTag: string, plaintextSha256: string }>}
 */
export async function encryptForUpload(file) {
  const keyBytes = crypto.getRandomValues(new Uint8Array(32)); // AES-256
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    "AES-GCM",
    false,
    ["encrypt"]
  );

  const plaintext = new Uint8Array(await file.arrayBuffer());
  const plaintextSha256 = toHex(await crypto.subtle.digest("SHA-256", plaintext));

  // WebCrypto returns ciphertext followed by the 16-byte GCM auth tag.
  const combined = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, plaintext)
  );
  const ciphertext = combined.slice(0, combined.length - 16);
  const authTag = combined.slice(combined.length - 16);

  return {
    blob: new Blob([ciphertext], { type: "application/octet-stream" }),
    encKey: toB64(keyBytes),
    encIv: toHex(iv),
    encAuthTag: toHex(authTag),
    plaintextSha256,
  };
}

/**
 * Append the encrypted file + its key material to a FormData for POST /api/upload.
 * The backend treats `clientEncrypted=1` as "already encrypted — don't re-encrypt".
 */
export async function buildEncryptedUpload(file, { category } = {}) {
  const enc = await encryptForUpload(file);
  const fd = new FormData();
  fd.append("file", enc.blob, file.name); // ciphertext
  fd.append("clientEncrypted", "1");
  fd.append("encKey", enc.encKey);
  fd.append("encIv", enc.encIv);
  fd.append("encAuthTag", enc.encAuthTag);
  fd.append("plaintextSha256", enc.plaintextSha256);
  fd.append("originalName", file.name);
  fd.append("mimeType", file.type || "application/octet-stream");
  if (category) fd.append("category", category);
  return fd;
}

// Legacy export kept for src/utils/upload.js (unused path).
export async function encryptFile(file) {
  const { blob } = await encryptForUpload(file);
  return blob;
}
