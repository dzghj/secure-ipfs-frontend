import React from "react";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();

  const documents = [
    { emoji: "🪪", title: "Driver's Licence",  type: "Identity · Encrypted"    },
    { emoji: "🏠", title: "Property Title",    type: "Real Estate · Encrypted"  },
    { emoji: "💉", title: "Health Records",    type: "Medical · Encrypted"      },
    { emoji: "📜", title: "Will & Testament",  type: "Legal · Encrypted"        },
  ];

  const features = [
    {
      icon: "🔐",
      title: "End-to-End Encrypted",
      desc: "Military-grade AES-256 encryption. Files are secured before leaving your device.",
    },
    {
      icon: "🌐",
      title: "Decentralized Storage",
      desc: "No single point of failure. Your documents are distributed across secure networks.",
    },
    {
      icon: "✨",
      title: "Zero Knowledge",
      desc: "We never have access to your files or encryption keys. Complete privacy.",
    },
    {
      icon: "📱",
      title: "24/7 Access",
      desc: "Access your vault anytime, anywhere on any device. Seamless synchronization.",
    },
    {
      icon: "👥",
      title: "Beneficiary Access",
      desc: "Securely share documents with trusted family members or executors.",
    },
    {
      icon: "☑️",
      title: "PIPEDA Compliant",
      desc: "Enterprise-grade security and full compliance with data protection regulations.",
    },
  ];

  const securityPoints = [
    { title: "AES-256 Encryption",            desc: "Industry standard encryption for all files"              },
    { title: "Zero Knowledge Architecture",   desc: "We cannot access your data even if requested"            },
    { title: "PIPEDA & CCPA Compliant",       desc: "Full compliance with international privacy laws"         },
    { title: "24/7 Security Monitoring",      desc: "Continuous protection and threat detection"              },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white">

      {/* ========== HERO SECTION ========== */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Your Life Documents,<br />
              <span className="text-primary">Secured Forever</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              SecureVault is your personal document vault — store, organize, and share life's most
              important files with military-grade encryption. Only you hold the keys.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-primary text-dark-bg hover:bg-primary-dark rounded-lg font-semibold transition text-lg flex items-center justify-center gap-2"
              >
                <span>✨</span> Start for Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-dark-bg rounded-lg font-semibold transition text-lg flex items-center justify-center gap-2"
              >
                <span>▶</span> See How It Works
              </button>
            </div>

            {/* Stats */}
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
                <div className="text-4xl font-bold text-primary mb-2">∞</div>
                <div className="text-xs text-gray-400 uppercase">Doc Categories</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-xs text-gray-400 uppercase">Access Anywhere</div>
              </div>
            </div>
          </div>

          {/* Right - Vault Mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border rounded-2xl p-8 backdrop-blur-sm">
              {/* Vault Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-dark-border">
                <div>
                  <div className="font-semibold">My Vault</div>
                  <div className="text-sm text-gray-400">24 documents secured</div>
                </div>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-dark-bg font-bold text-sm">
                  JM
                </div>
              </div>

              {/* Document Cards */}
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
                    <div className="text-primary">🔒</div>
                  </div>
                ))}
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-dark-bg text-center font-semibold text-sm">
                🛡️ End-to-End Encrypted • AES-256 • Zero Knowledge
              </div>
            </div>

            {/* Floating Security Icon */}
            <div className="absolute -bottom-4 -right-4 bg-primary text-dark-bg w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg">
              🔐
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section id="features" className="py-20 bg-dark-card bg-opacity-40 border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose SecureVault?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-dark-bg border border-dark-border rounded-xl p-6 hover:border-primary transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECURITY SECTION ========== */}
      <section id="security" className="py-20 max-w-7xl mx-auto px-6">
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
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold mb-4">Military-Grade Protection</h3>
            <p className="text-gray-400 mb-6">
              Your documents are protected with the same encryption technology used by governments
              and financial institutions worldwide.
            </p>
            <div className="bg-primary bg-opacity-20 border border-primary rounded-lg p-4">
              <div className="text-primary font-semibold">✓ Certified Secure</div>
              <div className="text-sm text-gray-400 mt-1">SOC 2 Type II Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark rounded-2xl mx-6 mb-6 text-dark-bg">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Secure Your Documents?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands protecting their most important files with SecureVault today.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-dark-bg text-primary hover:bg-gray-200 rounded-lg font-semibold transition text-lg"
          >
            Create Your Vault Now
          </button>
        </div>
      </section>

    </div>
  );
}
