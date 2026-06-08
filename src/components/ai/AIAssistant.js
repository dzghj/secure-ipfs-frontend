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
    <div className="bg-dark-card p-6 rounded-xl mb-6 border border-dark-border">
      <h3 className="font-semibold mb-3">🤖 AI Assistant</h3>

      <div className="flex gap-2 mt-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-dark-bg p-2 rounded border border-dark-border focus:outline-none focus:border-primary text-white placeholder-gray-500"
          placeholder="Ask anything..."
        />
        <button onClick={askAI} className="bg-primary text-dark-bg px-4 py-2 rounded font-semibold hover:bg-primary-dark transition">
          Ask
        </button>
      </div>

      {loading && <p className="text-gray-400 mt-3">Thinking...</p>}
      {response && <div className="mt-3 p-3 bg-dark-bg rounded border border-dark-border text-sm">{response}</div>}
    </div>
  );
}
