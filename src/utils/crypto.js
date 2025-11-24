export async function encryptFile(file) {
    const key = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const algo = { name: "AES-GCM", iv };
    const cryptoKey = await crypto.subtle.importKey("raw", key, algo, false, ["encrypt"]);
    const buffer = await file.arrayBuffer();
    const encrypted = await crypto.subtle.encrypt(algo, cryptoKey, buffer);
    return new Blob([iv, new Uint8Array(encrypted)], { type: "application/octet-stream" });
  }
  