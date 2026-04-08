import { useState } from "react";
import { updateKeyholdersAPI } from "../../services/api";

export default function KeyHolderManager({ file, token }) {
  const [emails, setEmails] = useState(file.keyHolderList || []);
  const [input, setInput] = useState("");

  const add = async () => {
    if (!input || emails.length >= 3) return;

    const updated = [...emails, input];
    await updateKeyholdersAPI(token, file.id, updated);

    setEmails(updated);
    setInput("");
  };

  return (
    <div className="mt-3">
      {emails.map(e => (
        <span key={e} className="text-xs bg-purple-700 px-2 mr-1">
          {e}
        </span>
      ))}

      <div className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-neutral-800 text-xs p-1"
        />
        <button onClick={add} className="text-blue-400 text-xs">
          Add
        </button>
      </div>
    </div>
  );
}