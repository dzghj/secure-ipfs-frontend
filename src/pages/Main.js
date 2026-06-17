import React from "react";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();

  const documents = [
    { emoji: "📜", title: "Will & Testament",  type: "Legal · Blockchain Anchored"  },
    { emoji: "🏠", title: "Property Title",    type: "Real Estate · Encrypted"      },
    { emoji: "💉", title: "Health Records",    type: "Medical · Encrypted"          },
    { emoji: "🪪", title: "Driver's Licence",  type: "Identity · Encrypted"         },
  ];

  const features = [
    {
      icon: "⛓️",
      title: "Blockchain Anchored",
      desc: "Every document is hashed and recorded on-chain. Tamper-proof, timestamped, and permanently verifiable.",
    },
    {
      icon: "🔐",
      title: "End-to-End Encrypted",
      desc: "Military-grade AES-256 encryption. Files are secured before leaving your device.",
    },
    {
      icon: "🌐",
      title: "Decentralized Storage",
      desc: "Stored on IPFS — no single point of failure. Your documents persist across distributed networks.",
    },
    {
      icon: "✨",
      title: "Zero Knowledge",
      desc: "We never have access to your files or encryption keys. Only you and your nominees can unlock them.",
    },
    {
      icon: "👥",
      title: "Heir & Nominee Access",
      desc: "Designate trusted executors and family members. Access is released automatically via your continuity switch.",
    },
    {
      icon: "☑️",
      title: "PIPEDA Compliant",
      desc: "Enterprise-grade security and full compliance with Canadian and international privacy regulations.",
    },
  ];

  const securityPoints = [
    { title: "Immutable Blockchain Record",     desc: "Document hashes stored on-chain — cannot be altered or deleted" },
    { title: "AES-256 Encryption",              desc: "Industry standard encryption applied before upload"              },
    { title: "Zero Knowledge Architecture",     desc: "We cannot access your data even if legally requested"           },
    { title: "PIPEDA & CCPA Compliant",         desc: "Full compliance with international privacy laws"                },
  ];

  const chainSteps = [
    { step: "01", title: "Upload Your Document",    desc: "Drag and drop your will, title deed, or legal file into your vault." },
    { step: "02", title: "Encrypted & Hashed",      desc: "Your file is AES-256 encrypted. A unique cryptographic hash is generated." },
    { step: "03", title: "Anchored On-Chain",       desc: "The hash is written to the blockchain — creating a permanent, tamper-proof record." },
    { step: "04", title: "Stored on IPFS",          desc: "The encrypted file is distributed across IPFS nodes. No central server to attack." },
    { step: "05", title: "Nominee Access Released", desc: "When your continuity switch triggers, designated heirs gain access automatically." },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white">

      {/* ========== HERO ========== */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary bg-opacity-10 border border-primary border-opacity-30 rounded-full px-4 py-2 text-sm text-primary font-medium mb-6">
              <span>⛓️</span> Blockchain-Secured Legal Documents
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Your Will, Your Legacy,<br />
              <span className="text-primary">On the Chain Forever</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              LegacyChain protects your wills and legal documents with blockchain immutability,
              AES-256 encryption, and IPFS decentralized storage. Your wishes — preserved exactly
              as you intended.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-primary text-dark-bg hover:bg-primary-dark rounded-lg font-semibold transition text-lg flex items-center justify-center gap-2"
              >
                <span>⛓️</span> Secure My Legacy
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-dark-bg rounded-lg font-semibold transition text-lg flex items-center justify-center gap-2"
              >
                <span>▶</span> See How It Works
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">256-bit</div>
                <div className="text-xs text-gray-400 uppercase">AES Encryption</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">0</div>
                <div className="text-xs text-gray-400 uppercase">Data Sold</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">IPFS</div>
                <div className="text-xs text-gray-400 uppercase">Decentralized</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-xs text-gray-400 uppercase">Access Anywhere</div>
              </div>
            </div>
          </div>

          {/* Right - Mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border rounded-2xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-dark-border">
                <div>
                  <div className="font-semibold">My Chain Vault</div>
                  <div className="text-sm text-gray-400">4 documents · blockchain verified</div>
                </div>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-dark-bg font-bold text-sm">
                  JM
                </div>
              </div>

              <div className="space-y-3">
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-dark-card bg-opacity-60 border border-dark-border rounded-lg p-4 hover:border-primary transition cursor-pointer flex items-start gap-3"
                  >
                    <div className="text-2xl">{doc.emoji}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{doc.title}</div>
                      <div className="text-xs text-gray-400">{doc.type}</div>
                    </div>
                    <div className="text-primary text-xs font-mono">⛓️</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-dark-bg text-center font-semibold text-sm">
                ⛓️ Blockchain Anchored • AES-256 • IPFS Distributed
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-primary text-dark-bg w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg">
              ⛓️
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW THE CHAIN WORKS ========== */}
      <section className="py-20 border-y border-dark-border bg-dark-card bg-opacity-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3">How LegacyChain Works</h2>
            <p className="text-gray-400 text-lg">From upload to on-chain proof — in seconds.</p>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {chainSteps.map((s) => (
                <div key={s.step} className="flex flex-col items-center text-center relative">
                  <div className="w-16 h-16 rounded-full bg-primary bg-opacity-15 border-2 border-primary flex items-center justify-center text-primary font-bold text-lg mb-4 z-10">
                    {s.step}
                  </div>
                  <h4 className="font-semibold text-sm mb-2">{s.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose LegacyChain?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECURITY ========== */}
      <section id="security" className="py-20 bg-dark-card bg-opacity-30 border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Enterprise-Grade Security</h2>
              <div className="space-y-6">
                {securityPoints.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="text-primary text-2xl flex-shrink-0">✓</div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">⛓️</div>
              <h3 className="text-2xl font-bold mb-4">Immutable by Design</h3>
              <p className="text-gray-400 mb-6">
                Once your document hash is written to the blockchain, no one — not even us — can
                alter, delete, or dispute its existence.
              </p>
              <div className="bg-primary bg-opacity-20 border border-primary rounded-lg p-4">
                <div className="text-primary font-semibold">✓ Blockchain Verified</div>
                <div className="text-sm text-gray-400 mt-1">Immutable · Timestamped · Trustless</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark rounded-2xl mx-6 mb-10 text-dark-bg">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="text-5xl mb-4">⛓️</div>
          <h2 className="text-4xl font-bold mb-4">Protect Your Legacy Today</h2>
          <p className="text-lg mb-8 opacity-90">
            Your will deserves more than a filing cabinet. Anchor it on the blockchain — forever.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-dark-bg text-primary hover:bg-gray-900 rounded-lg font-semibold transition text-lg"
          >
            Create Your Chain Vault
          </button>
        </div>
      </section>

    </div>
  );
}
