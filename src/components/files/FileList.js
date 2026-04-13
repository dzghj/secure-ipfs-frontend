import FileCard from "./FileCard";
export default function FileList({ files, token }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {files.map(f => (
        <FileCard key={f.id} file={f} token={token} />
      ))}
    </div>
  );
}