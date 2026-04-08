import FileCard from "./FileCard";

export default function FileList({ files, token }) {
  return (
    <div className="space-y-4">
      {files.map(f => (
        <FileCard key={f.id} file={f} token={token} />
      ))}
    </div>
  );
}
