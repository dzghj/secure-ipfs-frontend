import React, { useEffect, useRef, useState } from "react";
import { sendSupportMessageAPI, getSupportMessageAPI } from "../../services/api";

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 90000; // give up waiting on a reply after ~90s

let nextId = 1;
const uid = () => nextId++;

export default function SupportChat({ open, onClose }) {
  const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([
    {
      id: uid(),
      role: "assistant",
      text: "Hi! Ask me anything about your vault, check-ins, legacy contacts, or uploads — I'll do my best to help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const pollForReply = async (supportId, assistantMsgId) => {
    const startedAt = Date.now();

    const tick = async () => {
      if (!mountedRef.current) return;
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, pending: false, text: "This is taking longer than expected — please try again in a moment." }
              : m
          )
        );
        return;
      }

      try {
        const result = await getSupportMessageAPI(token, supportId);
        if (result.status === "pending") {
          setTimeout(tick, POLL_INTERVAL_MS);
          return;
        }
        if (!mountedRef.current) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  pending: false,
                  text:
                    result.reply ||
                    "Sorry, I couldn't come up with an answer for that. Please try rephrasing, or check back shortly.",
                }
              : m
          )
        );
      } catch (err) {
        if (!mountedRef.current) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, pending: false, text: `Couldn't reach support: ${err.message}` } : m
          )
        );
      }
    };

    tick();
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    if (!token) {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", text: "Please log in to message support." },
      ]);
      return;
    }

    setInput("");
    setSending(true);

    const userMsgId = uid();
    const assistantMsgId = uid();
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", text },
      { id: assistantMsgId, role: "assistant", text: "", pending: true },
    ]);

    try {
      const { id: supportId } = await sendSupportMessageAPI(token, text);
      pollForReply(supportId, assistantMsgId);
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, pending: false, text: `Couldn't send that: ${err.message}` } : m
        )
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-dark-border bg-dark-card shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-border bg-dark-bg px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-sm font-semibold text-white">24/7 Support</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close support chat"
          className="text-lg leading-none text-gray-500 transition hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex h-96 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-white"
                  : "bg-dark-bg border border-dark-border text-gray-200"
              }`}
            >
              {m.pending ? (
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                </span>
              ) : (
                m.text
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 border-t border-dark-border p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={token ? "Describe your issue…" : "Log in to contact support"}
          disabled={!token}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-dark-border bg-dark-bg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-primary disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!token || sending || !input.trim()}
          className="flex-shrink-0 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}
