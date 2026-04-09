import { useState } from "react";
import { askAIAPI } from "../../services/api";

export default function AIAssistant({ token }) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!input) return;
    setLoading(true);

    try {
      const res = await askAIAPI(token, input);
      setResponse(res);
    } catch {
      setResponse("AI failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-800 p-6 rounded-xl mb-6">
      <h3>🤖 AI Assistant</h3>

      <div className="flex gap-2 mt-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-neutral-800 p-2 rounded"
        />
        <button onClick={askAI} className="bg-blue-600 px-4">
          Ask
        </button>
      </div>

      {loading && <p>Thinking...</p>}
      {response && <div className="mt-3">{response}</div>}
    </div>
  );
}
