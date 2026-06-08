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
        <span key={e} className="text-xs bg-primary text-dark-bg px-2 mr-1 rounded font-semibold">
          {e}
        </span>
      ))}

      <div className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-dark-bg text-xs p-1 border border-dark-border rounded focus:outline-none focus:border-primary text-white placeholder-gray-500"
          placeholder="email@example.com"
        />
        <button onClick={add} className="text-primary text-xs font-medium hover:text-primary-dark transition">
          Add
        </button>
      </div>
    </div>
  );
}