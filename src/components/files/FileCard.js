import KeyHolderManager from "./KeyHolderManager";

export default function FileCard({ file, token }) {
  return (
    <div className="bg-neutral-900 p-6 rounded-xl">
      <h4>{file.filename}</h4>
      <p className="text-sm text-gray-400">
        {new Date(file.uploadedAt).toLocaleDateString()}
      </p>

      <KeyHolderManager file={file} token={token} />
    </div>
  );
}