import React, { useState, useEffect, useCallback } from "react";
import {
  fetchNomineesAPI,
  createNomineeAPI,
  updateNomineeAPI,
  deleteNomineeAPI,
} from "../../services/api";
const FORM_FIELDS = [
  { label: "Name",         key: "name",         placeholder: "Enter Name",                   type: "text"  },
  { label: "Email",        key: "email",        placeholder: "Enter Email",                  type: "email" },
  { label: "Phone Number", key: "phone",        placeholder: "Enter Phone Number",           type: "tel"   },
  { label: "Relationship", key: "relationship", placeholder: "e.g. Spouse, Sibling, Lawyer", type: "text" },
];

const ACCESS_LEVELS = [
  { id: "full",    label: "Full Access",    desc: "All folders & files"   },
  { id: "partial", label: "Partial Access", desc: "Selected folders only" },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  relationship: "",
  accessLevel: "full",
  allowedFolders: [],
};

/* ── Add / Edit nominee form ──────────────────────────────── */
function NomineeForm({ onSave, onBack, allCategories, initial }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const toggleFolder = (cat) => {
    setForm((prev) => {
      const already = prev.allowedFolders.includes(cat);
      return {
        ...prev,
        allowedFolders: already
          ? prev.allowedFolders.filter((f) => f !== cat)
          : [...prev.allowedFolders, cat],
      };
    });
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return alert("Name and email are required.");
    if (form.accessLevel === "partial" && form.allowedFolders.length === 0) {
      return alert("Please select at least one folder for partial access.");
    }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-dark-border text-primary hover:bg-white/5 transition text-xl font-bold"
          aria-label="Back to nominees"
        >
          ‹
        </button>
        <div>
          <h1 className="text-3xl font-bold">
            {initial ? "Edit Nominee" : "Add New Nominee"}
          </h1>
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

        {/* Access level selector */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-3 block font-medium">Access Level</label>
          <div className="flex gap-3">
            {ACCESS_LEVELS.map((a) => (
              <button
                key={a.id}
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    accessLevel: a.id,
                    allowedFolders: a.id === "full" ? [] : p.allowedFolders,
                  }))
                }
                className={`flex-1 py-4 px-4 rounded-xl border-2 text-left transition-all hover:border-primary ${
                  form.accessLevel === a.id
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

        {/* Folder picker — only shown for partial access */}
        {form.accessLevel === "partial" && (
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-3 block font-medium">
              Select Accessible Folders
            </label>
            {allCategories.length === 0 ? (
              <p className="text-xs text-gray-500">
                No folders found. Create a folder in your vault first.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => {
                  const selected = form.allowedFolders.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleFolder(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        selected
                          ? "bg-primary border-primary text-white"
                          : "border-dark-border text-gray-400 hover:border-primary"
                      }`}
                    >
                      {selected ? "✓ " : ""}{cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex items-start gap-3 bg-primary bg-opacity-10 border border-primary border-opacity-30 rounded-xl p-4 mb-6 text-sm text-gray-300">
          <span className="text-xl flex-shrink-0">🔒</span>
          Nominees can only access data according to the permissions you assign. You can update or
          revoke access at any time.
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Nominee"}
        </button>
      </div>
    </div>
  );
}

/* ── Main nominees list page ──────────────────────────────── */
export default function NomineesPage({ allCategories = [], nominees = [], onNomineesChange }) {
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);

  const token = localStorage.getItem("token");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNomineesAPI(token);
      onNomineesChange?.(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    if (editing) {
      const updated = await updateNomineeAPI(token, editing.id, form);
      onNomineesChange?.(nominees.map((n) => (n.id === updated.id ? updated : n)));
    } else {
      const created = await createNomineeAPI(token, form);
      onNomineesChange?.([...nominees, created]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this nominee?")) return;
    try {
      await deleteNomineeAPI(token, id);
      onNomineesChange?.(nominees.filter((n) => n.id !== id));
    } catch (e) {
      alert("Failed to remove nominee.");
    }
  };

  const openEdit = (nominee) => {
    setEditing(nominee);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <NomineeForm
        onSave={handleSave}
        onBack={() => { setShowForm(false); setEditing(null); }}
        allCategories={allCategories}
        initial={
          editing
            ? {
                name: editing.name,
                email: editing.email,
                phone: editing.phone || "",
                relationship: editing.relationship || "",
                accessLevel: editing.accessLevel || "full",
                allowedFolders: editing.allowedFolders || [],
              }
            : undefined
        }
      />
    );
  }

  return (
    <div className="px-8 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Nominees</h1>
          <p className="text-gray-400 text-sm">Trusted people who can access your vault.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
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

        {loading ? (
          <div className="text-center py-6 text-gray-400 text-sm">Loading…</div>
        ) : nominees.length === 0 ? (
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
                    {n.email}{n.relationship ? ` · ${n.relationship}` : ""}
                  </div>
                  {n.accessLevel === "partial" && n.allowedFolders?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {n.allowedFolders.map((f) => (
                        <span
                          key={f}
                          className="text-xs px-2 py-0.5 bg-blue-900 bg-opacity-40 text-blue-300 border border-blue-800 rounded-full"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <span
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold flex-shrink-0 ${
                    n.accessLevel === "full"
                      ? "bg-emerald-500 bg-opacity-20 text-emerald-400 border border-emerald-500 border-opacity-30"
                      : "bg-blue-500 bg-opacity-20 text-blue-400 border border-blue-500 border-opacity-30"
                  }`}
                >
                  {n.accessLevel === "full" ? "✓ Full" : "◑ Partial"}
                </span>

                <div className="flex gap-2 flex-shrink-0 ml-2">
                  <button
                    onClick={() => openEdit(n)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-dark-border text-gray-400 hover:border-primary hover:text-white transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-800 text-red-400 hover:bg-red-900 hover:bg-opacity-30 transition"
                  >
                    Remove
                  </button>
                </div>
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
