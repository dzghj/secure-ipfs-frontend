import React from "react";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* ---------- Hero Section ---------- */}
      <section className="flex flex-col items-center text-center px-6 pt-32">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-4xl">
         Digital Chain Vault<br />
          <span className="text-indigo-500 text-xl md:text-2xl font-semibold">
            Encrypted. Decentralized. Unstoppable.
          </span>

        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl text-lg">
          Secure your wills, legal documents, ownership records, and
          high-value assets on a decentralized IPFS network.
          End-to-end encrypted. No central authority.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex gap-4">
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition"
          >
            Create Your Vault
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 border border-gray-600 hover:border-indigo-500 rounded-lg font-semibold transition"
          >
            Access Vault
          </button>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="mt-40 px-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            title: "End-to-End Encryption",
            desc: "Files are encrypted before leaving your device. Only you control the decryption keys.",
          },
          {
            title: "Decentralized Storage (IPFS)",
            desc: "Stored across distributed nodes — no single server can delete or censor your documents.",
          },
          {
            title: "Immutable & Tamper-Resistant",
            desc: "Cryptographic hashing ensures your documents cannot be altered without detection.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition"
          >
            <h3 className="text-xl font-semibold mb-3">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

    </div>
  );
}
