import React, { useState } from "react";

const FORM_FIELDS = [
  { label: "Name",         key: "name",         placeholder: "Enter Name",               type: "text"  },
  { label: "Email",        key: "email",        placeholder: "Enter Email",              type: "email" },
  { label: "Phone Number", key: "phone",        placeholder: "Enter Phone Number",       type: "tel"   },
  { label: "Relationship", key: "relationship", placeholder: "e.g. Spouse, Sibling, Lawyer", type: "text" },
];

const ACCESS_LEVELS = [
  { id: "full",    label: "Full Access",    desc: "All folders & files"   },
  { id: "partial", label: "Partial Access", desc: "Selected folders only" },
];

const EMPTY_FORM = { name: "", email: "", phone: "", relationship: "", access: "full" };

function AddNomineeForm({ onSave, onBack }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSave = () => {
    if (!form.name || !form.email) return alert("Name and email are required.");
    onSave({ ...form, id: Date.now() });
  };

  return (
    <div className="w-full px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-dark-border text-primary hover:bg-white/5 transition text-xl font-bold"
          aria-label="Back to nominees"
        >
          ‹
        </button>
        <div>
          <h1 className="text-3xl font-bold">Add New Nominee</h1>
          <p className="text-gray-400 text-sm">Grant vault access to a trusted person.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        {FORM_FIELDS.map((f) => (
          <div key={f.key} className="mb-5">
            <label className="text-sm text-gray-400 mb-2 block font-medium">{f.label}</label>
            <div className="flex items-center bg-dark-card border border-dark-border rounded-xl px-4 focus-within:border-primary transition">
              <span className="text-gray-500 mr-3 text-lg">👤</span>
              <input
                className="flex-1 bg-transparent py-3 text-white placeholder-gray-500 outline-none"
                type={f.type}
                value={form[f.key]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
              />
            </div>
          </div>
        ))}

        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-3 block font-medium">Access Level</label>
          <div className="flex gap-3">
            {ACCESS_LEVELS.map((a) => (
              <button
                key={a.id}
                onClick={() => setForm((p) => ({ ...p, access: a.id }))}
                className={`flex-1 py-4 px-4 rounded-xl border-2 text-left transition-all hover:border-primary ${
                  form.access === a.id
                    ? "border-primary bg-dark-card"
                    : "border-dark-border bg-dark-card bg-opacity-50"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm mb-1">
                  <span>📁</span> {a.label}
                </div>
                <div className="text-xs text-gray-400">{a.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 bg-primary bg-opacity-10 border border-primary border-opacity-30 rounded-xl p-4 mb-6 text-sm text-gray-300">
          <span className="text-xl flex-shrink-0">🔒</span>
          Nominees can only access data according to the permissions you assign. You can update or
          revoke access at any time.
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition"
        >
          Save Nominee
        </button>
      </div>
    </div>
  );
}

export default function NomineesPage() {
  const [nominees, setNominees] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (nominee) => {
    setNominees((prev) => [...prev, nominee]);
    setShowForm(false);
  };

  if (showForm) {
    return <AddNomineeForm onSave={handleSave} onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="w-full px-8 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Nominees</h1>
          <p className="text-gray-400 text-sm">Trusted people who can access your vault.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-dark transition flex items-center gap-2"
        >
          <span>👥</span> Add Nominee +
        </button>
      </div>

      {/* Nominee list card */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6 hover:border-primary transition">
        <h3 className="text-xl font-semibold text-primary mb-2">Nominee Access</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          Add trusted individuals who can access your vault data if you miss a check-in.
        </p>

        {nominees.length === 0 ? (
          <div className="flex items-center gap-4 bg-dark-bg border border-dark-border rounded-xl p-4">
            <div className="w-11 h-11 rounded-xl bg-primary bg-opacity-10 border border-primary border-opacity-20 flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">No nominees added yet</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Add trusted individuals to protect your vault.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {nominees.map((n) => (
              <div
                key={n.id}
                className="flex items-center gap-4 bg-dark-bg border border-dark-border rounded-xl p-4 hover:border-primary transition"
              >
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                  {n.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">{n.name}</div>
                  <div className="text-xs text-gray-400 truncate">
                    {n.email} · {n.relationship}
                  </div>
                </div>
                <span
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold flex-shrink-0 ${
                    n.access === "full"
                      ? "bg-emerald-500 bg-opacity-20 text-emerald-400 border border-emerald-500 border-opacity-30"
                      : "bg-blue-500 bg-opacity-20 text-blue-400 border border-blue-500 border-opacity-30"
                  }`}
                >
                  {n.access === "full" ? "✓ Full" : "◑ Partial"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-5">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span>🛡️</span> How Nominee Access Works
        </h4>
        <div className="space-y-3">
          {[
            "Nominees are notified only when you miss a check-in deadline.",
            "You control exactly which folders each nominee can access.",
            "You can update or remove nominees at any time.",
          ].map((text, i) => (
            <div key={i} className="flex gap-3 items-start text-sm text-gray-400">
              <span className="text-primary flex-shrink-0 mt-0.5">✓</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
