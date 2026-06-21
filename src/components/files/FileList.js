import FileCard from "./FileCard";

export default function FileList({ files, token, nominees = [] }) {
  if (!files || files.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">📂</div>
        <p className="text-gray-400 text-sm">No files in this folder.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {files.map((f) => (
        <FileCard key={f.id} file={f} token={token} nominees={nominees} />
      ))}
    </div>
  );
}
