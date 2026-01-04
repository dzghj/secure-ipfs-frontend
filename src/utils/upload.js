import { Web3Storage } from "web3.storage";
import { encryptFile } from "./crypto";

const client = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_TOKEN });

export async function uploadEncryptedPDF(file, token) {
  const encryptedBlob = await encryptFile(file);

  const cid = await client.put([new File([encryptedBlob], file.name)], {
    wrapWithDirectory: false,
  });

  const res = await fetch("https://secure-ipfs-server.onrender.com/api/registerCID", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ cid, filename: file.name }),
  });

  if (!res.ok) throw new Error("CID registration failed");
  return { cid, ...(await res.json()) };
}
