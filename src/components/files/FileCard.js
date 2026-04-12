import KeyHolderManager from "./KeyHolderManager";
import { useState } from "react";

export default function FileCard({ file, token }) {
  const [copied, setCopied] = useState(false);

  const createdDate = file.uploadedAt
    ? new Date(file.uploadedAt).toLocaleDateString()
    : "—";

  const lastAccessDate = file.lastAccessedAt
    ? new Date(file.lastAccessedAt).toLocaleString()
    : "—";

  const isProtected = file.protectionOn;

  const copyCID = () => {
    if (!file.cid) return;
    navigator.clipboard.writeText(file.cid);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-blue-800 border border-neutral-800 rounded-xl p-6">

      <table className="w-full text-sm text-left text-gray-300">
        <tbody className="divide-y divide-neutral-800">

          {/* File Name */}
          <tr>
            <td className="px-4 py-3 text-white w-1/3">File Name</td>
            <td className="px-4 py-3 font-medium text-white">
              {file.filename}
            </td>
          </tr>

          {/* Created */}
          <tr>
            <td className="px-4 py-3 text-white">Created</td>
            <td className="px-4 py-3 font-medium text-white">
              {createdDate}
            </td>
          </tr>

          {/* ✅ Last Access Time */}
          <tr>
            <td className="px-4 py-3 text-white">Last Access</td>
            <td className="px-4 py-3 text-gray-300">
              {lastAccessDate}
            </td>
          </tr>

          {/* Integrity */}
          <tr>
            <td className="px-4 py-3 text-white">Integrity Status</td>
            <td className="px-4 py-3 text-blue-400 font-medium">
              Blockchain Anchored & Verified
              {file.verifiedAt && (
                <span className="text-xs text-gray-300 ml-2">
                  ({new Date(file.verifiedAt).toLocaleString()})
                </span>
              )}
            </td>
          </tr>

          {/* CID + Copy */}
          <tr>
            <td className="px-4 py-3 text-white align-top">
              CID Reference
            </td>
            <td className="px-4 py-3 text-xs text-blue-400 break-all">
              <div className="flex items-center gap-2">
                <span className="break-all">{file.cid || "—"}</span>
                {file.cid && (
                  <button
                    onClick={copyCID}
                    className="text-xs bg-neutral-700 px-2 py-1 rounded hover:bg-neutral-600"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
            </td>
          </tr>

          {/* ✅ IP Address */}
          <tr>
            <td className="px-4 py-3 text-white">
              Last Access IP
            </td>
            <td className="px-4 py-3 text-gray-300">
              {file.lastIp || "Unknown"}
            </td>
          </tr>

          {/* ✅ Location */}
          <tr>
            <td className="px-4 py-3 text-white">
              Location
            </td>
            <td className="px-4 py-3 text-gray-300">
              {file.lastLocation || "Unknown"}
            </td>
          </tr>

          {/* Dead Man */}
          <tr>
            <td className="px-4 py-3 text-white">
              Dead Man Protection
            </td>
            <td className="px-4 py-3">
              <button
                className={`px-4 py-1 rounded-md text-xs font-medium transition ${
                  isProtected
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-neutral-700 hover:bg-neutral-600"
                }`}
              >
                {isProtected ? "Enabled" : "Disabled"}
              </button>
            </td>
          </tr>

          {/* Remaining */}
          <tr>
            <td className="px-4 py-3 text-white">
              KeyHolder Unlock Remaining
            </td>
            <td className="px-4 py-3 text-purple-400 text-sm">
              {isProtected ? "30 days remaining" : "—"}
            </td>
          </tr>

          {/* Keyholders */}
          <tr>
            <td className="px-4 py-3 text-white">
              KeyHolder Emails
            </td>
            <td className="px-4 py-3 text-sm">
              <KeyHolderManager file={file} token={token} />
            </td>
          </tr>

          {/* Audit */}
          <tr>
            <td className="px-4 py-3 text-white">
              Audit Log
            </td>
            <td className="px-4 py-3 text-blue-400 font-medium">
              {/* future */}
            </td>
          </tr>

          {/* Access */}
          <tr>
            <td className="px-4 py-3 text-white">
              Secure Access
            </td>
            <td className="px-4 py-3">
              <button
                className="px-5 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700"
                onClick={() => {
                  window.open(`/api/file/${file.id}/view`, "_blank");
                }}
              >
                View
              </button>
            </td>
          </tr>

        </tbody>
      </table>

    </div>
  );
}