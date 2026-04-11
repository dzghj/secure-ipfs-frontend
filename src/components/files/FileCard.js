import KeyHolderManager from "./KeyHolderManager";

export default function FileCard({ file, token }) {

  const createdDate = file.uploadedAt
    ? new Date(file.uploadedAt).toLocaleDateString()
    : "—";

  const isProtected = file.protectionOn;

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">

      <table className="w-full text-sm text-left text-gray-300">
        <tbody className="divide-y divide-neutral-800">

          {/* File Name */}
          <tr>
            <td className="px-4 py-3 text-gray-500 w-1/3">
              File Name
            </td>
            <td className="px-4 py-3 font-medium text-white">
              {file.filename}
            </td>
          </tr>

          {/* Created */}
          <tr>
            <td className="px-4 py-3 text-gray-500">
              Created
            </td>
            <td className="px-4 py-3 font-medium text-white">
              {createdDate}
            </td>
          </tr>

          {/* Integrity */}
          <tr>
            <td className="px-4 py-3 text-gray-500">
              Integrity Status
            </td>
            <td className="px-4 py-3 text-blue-400 font-medium">
              Blockchain Anchored & Verified
            </td>
          </tr>

          {/* CID */}
          <tr>
            <td className="px-4 py-3 text-gray-500 align-top">
              CID Reference
            </td>
            <td className="px-4 py-3 text-xs text-blue-400 break-all">
              {file.cid}
            </td>
          </tr>

          {/* Dead Man */}
          <tr>
            <td className="px-4 py-3 text-gray-500">
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
            <td className="px-4 py-3 text-gray-500">
              KeyHolder Unlock Remaining
            </td>
            <td className="px-4 py-3 text-purple-400 text-sm">
              {isProtected ? "30 days remaining" : "—"}
            </td>
          </tr>

          {/* Keyholders */}
          <tr>
            <td className="px-4 py-3 text-gray-500">
              KeyHolder Emails
            </td>
            <td className="px-4 py-3 text-sm">
              <KeyHolderManager file={file} token={token} />
            </td>
          </tr>

          {/* Audit */}
          <tr>
            <td className="px-4 py-3 text-gray-500">
              Audit Log
            </td>
            <td className="px-4 py-3 text-blue-400 font-medium">
              {/* future */}
            </td>
          </tr>

          {/* Access */}
          <tr>
            <td className="px-4 py-3 text-gray-500">
              Secure Access
            </td>
            <td className="px-4 py-3">
              <button
                className="px-5 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700"
                onClick={() => {
                  // keep your existing logic if you have one
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