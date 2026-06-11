import { useEffect, useState, useCallback } from "react";
import UpgradeModal from "../components/common/UpgradeModal";
import Loader from "../components/common/Loader";
import { fetchFilesAPI } from "../services/api";
import FileList from "../components/files/FileList";

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function IconVault({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#ffffff" : "#9ca3af"} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="12" cy="12" r="3" />
      <line x1="3" y1="8" x2="21" y2="8" />
    </svg>
  );
}

function IconAddFolder({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#ffffff" : "#9ca3af"} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  );
}

function IconNominees({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#ffffff" : "#9ca3af"} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconSwitch({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#ffffff" : "#9ca3af"} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

// ─── Folder colour picker data ────────────────────────────────────────────────

const FOLDER_TYPES = [
  { id: "personal", label: "Personal", color: "#9b87f5" },
  { id: "finance",  label: "Finance",  color: "#4a7fd4" },
  { id: "work",     label: "Work",     color: "#2eaaa0" },
  { id: "family",   label: "Family",   color: "#7e78d2" },
  { id: "photos",   label: "Photos",   color: "#3fa89e" },
  { id: "videos",   label: "Videos",   color: "#7e9c4a" },
  { id: "medical",  label: "Medical",  color: "#e07b6a" },
  { id: "legal",    label: "Legal",    color: "#c47fc0" },
  { id: "other",    label: "Other",    color: "#a0a0a0" },
];

function FolderIcon({ color }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M4 10a3 3 0 0 1 3-3h8l3 4h14a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V10z"
        fill={color} opacity="0.9" />
      <path d="M4 16h32v13a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V16z" fill={color} />
    </svg>
  );
}

// ─── Tab: Vault ───────────────────────────────────────────────────────────────

function VaultPage({ files, token, hasReachedLimit, onUpgrade }) {
  return (
    <div className="max-w-2xl w-full px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Vault</h1>

      {hasReachedLimit ? (
        <div className="bg-yellow-600 text-black p-4 rounded-xl text-center mb-6">
          You reached your plan limit.
          <button
            onClick={onUpgrade}
            className="ml-3 bg-black text-white px-4 py-2 rounded-lg"
          >
            Upgrade Plan
          </button>
        </div>
      ) : (
        <div className="bg-dark-card p-6 rounded-xl text-center border mb-6">
          <p className="text-sm text-gray-400">Upload encrypted files securely.</p>
        </div>
      )}

      <div className="mt-2 bg-dark-card p-6 rounded-2xl border">
        <h3 className="text-lg font-semibold mb-2">📁 Vault Records</h3>
        <p className="text-sm text-gray-400 mb-4">Encrypted and stored securely.</p>
        <FileList files={files} token={token} />
        {files.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-4">No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Add Folder ──────────────────────────────────────────────────────────

function AddFolderPage() {
  const [categoryName, setCategoryName] = useState("Personal");
  const [description, setDescription]   = useState("");
  const [selected, setSelected]         = useState("personal");

  return (
    <div className="max-w-2xl w-full px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Add New Folder</h1>

      <div className="mb-5">
        <label className="text-sm text-gray-400 mb-2 block">Category Name</label>
        <input
          className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-primary"
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
          placeholder="Category Name"
        />
      </div>

      <div className="mb-5">
        <label className="text-sm text-gray-400 mb-2 block">Description</label>
        <input
          className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-primary"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>

      <div className="mb-8">
        <label className="text-sm text-gray-400 mb-3 block">Select Folder Colour</label>
        <div className="grid grid-cols-3 gap-3">
          {FOLDER_TYPES.map(ft => (
            <button
              key={ft.id}
              onClick={() => { setSelected(ft.id); setCategoryName(ft.label); }}
              className={`flex flex-col items-center py-4 px-2 rounded-2xl border-2 transition-all ${
                selected === ft.id
                  ? "border-primary bg-white/10"
                  : "border-transparent bg-white/5 hover:bg-white/10"
              }`}
            >
              <FolderIcon color={ft.color} />
              <span className="text-xs text-gray-300 mt-2">{ft.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => alert(`Folder "${categoryName}" created!`)}
        className="w-full bg-primary text-white py-4 rounded-xl font-semibold"
      >
        Create Folder
      </button>
    </div>
  );
}

// ─── Tab: Nominees ────────────────────────────────────────────────────────────

function NomineesPage() {
  const [nominees, setNominees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", relationship: "", access: "full",
  });

  const handleSave = () => {
    if (!form.name || !form.email) return alert("Name and email are required.");
    setNominees(prev => [...prev, { ...form, id: Date.now() }]);
    setForm({ name: "", email: "", phone: "", relationship: "", access: "full" });
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="max-w-2xl w-full px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setShowForm(false)}
            className="text-primary text-2xl font-bold leading-none"
          >
            ‹
          </button>
          <h1 className="text-2xl font-semibold">Add New Nominee</h1>
        </div>

        {[
          { label: "Name",         key: "name",         placeholder: "Enter Name",         type: "text"  },
          { label: "Email",        key: "email",        placeholder: "Enter Email",        type: "email" },
          { label: "Phone Number", key: "phone",        placeholder: "Enter Phone Number", type: "tel"   },
          { label: "Relationship", key: "relationship", placeholder: "Enter Relationship", type: "text"  },
        ].map(f => (
          <div key={f.key} className="mb-5">
            <label className="text-sm text-gray-400 mb-2 block">{f.label}</label>
            <div className="flex items-center bg-white/10 border border-white/10 rounded-xl px-4">
              <span className="text-gray-500 mr-3">👤</span>
              <input
                className="flex-1 bg-transparent py-3 text-white placeholder-gray-500 outline-none"
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
              />
            </div>
          </div>
        ))}

        <div className="mb-5">
          <label className="text-sm text-gray-400 mb-2 block">Access</label>
          <div className="flex gap-3">
            {["full", "partial"].map(a => (
              <button
                key={a}
                onClick={() => setForm(p => ({ ...p, access: a }))}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                  form.access === a
                    ? "border-primary bg-white/10 text-white"
                    : "border-white/10 bg-white/5 text-gray-400"
                }`}
              >
                <span>📁</span>
                {a === "full" ? "Full Access" : "Partial Access"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 bg-blue-900/40 border border-blue-500/30 rounded-xl p-4 mb-6 text-sm text-blue-300">
          <span className="text-lg">🔒</span>
          Nominees can only access data according to the permissions you assign.
        </div>

        <button onClick={handleSave} className="w-full bg-primary text-white py-4 rounded-xl font-semibold">
          Save Nominee
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl w-full px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Nominees</h1>

      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mb-8">
        <h3 className="text-lg font-semibold text-blue-400">Nominee Access</h3>
        <p className="text-sm text-gray-400 mt-2 mb-4">
          Add trusted individuals who can access your vault data if you miss a check-in.
        </p>
        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
          <div className="w-10 h-10 rounded-xl bg-green-900/40 flex items-center justify-center text-xl">👤</div>
          <span className="text-gray-400 text-sm">No nominees added</span>
        </div>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-400">Your Nominees</h3>
          <p className="text-sm text-gray-400">People who can access your vault.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap"
        >
          Add Nominee +
        </button>
      </div>

      {nominees.map(n => (
        <div key={n.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
            {n.name[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-white">{n.name}</div>
            <div className="text-xs text-gray-400">{n.email} · {n.relationship}</div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            n.access === "full"
              ? "bg-emerald-900/50 text-emerald-400"
              : "bg-blue-900/50 text-blue-400"
          }`}>
            {n.access === "full" ? "Full" : "Partial"}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Switch ──────────────────────────────────────────────────────────────

function SwitchPage({ checkin, setCheckin, onSave }) {
  const [customDays, setCustomDays] = useState("");

  const steps = [
    "Choose how often you want to confirm your activity in the app.",
    "You must open the app at least once within this period to confirm you are active.",
    "Each successful login resets your check-in timer.",
    "If you do not log in within your selected period, the system marks you as inactive.",
    "Your assigned nominees will then be notified as per your access settings.",
  ];

  return (
    <div className="max-w-2xl w-full px-6 py-10">
      <h1 className="text-2xl font-semibold text-center mb-6">Continuity Switch</h1>

      {/* Status banner */}
      <div className="rounded-2xl mb-8 bg-gradient-to-b from-green-100 to-green-200 p-8 text-center shadow">
        <img src="/image1.png" alt="checked" className="mx-auto w-24 h-24 mb-4" />
        <div className="text-2xl font-semibold text-gray-900">Successfully Checked-In!</div>
      </div>

      {/* Interval picker */}
      <div className="mb-6">
        <h2 className="text-lg mb-4">Change Check-in Interval</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "7",  label: "Every 7 days"  },
            { id: "14", label: "Every 14 days" },
            { id: "30", label: "Every 30 days" },
            { id: "90", label: "Every 90 days" },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setCheckin(opt.id)}
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                checkin === opt.id
                  ? "border-primary bg-white text-gray-900"
                  : "bg-white/20 border-transparent text-gray-900"
              }`}
            >
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                checkin === opt.id ? "border-primary bg-primary" : "border-gray-400 bg-transparent"
              }`} />
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCheckin("custom")}
          className={`mt-4 w-full p-4 rounded-xl flex items-center gap-3 ${
            checkin === "custom"
              ? "border border-primary bg-white text-gray-900"
              : "bg-white/20 text-gray-900"
          }`}
        >
          <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
            checkin === "custom" ? "border-primary bg-primary" : "border-gray-400 bg-transparent"
          }`} />
          Custom Days
          {checkin === "custom" && (
            <input
              type="number"
              value={customDays}
              onClick={e => e.stopPropagation()}
              onChange={e => setCustomDays(e.target.value)}
              placeholder="e.g. 45"
              className="ml-auto w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none text-gray-900"
            />
          )}
        </button>
      </div>

      {/* How it works */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">How Check-In Works</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-gray-300 flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onSave}
        className="w-full bg-primary text-white py-4 rounded-xl font-semibold"
      >
        Save Changes
      </button>
    </div>
  );
}

// ─── Sidebar nav config ───────────────────────────────────────────────────────

const TABS = [
  { id: "vault",     label: "Vault",      Icon: IconVault     },
  { id: "addFolder", label: "Add Folder", Icon: IconAddFolder },
  { id: "nominees",  label: "Nominees",   Icon: IconNominees  },
  { id: "switch",    label: "Switch",     Icon: IconSwitch    },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyFiles() {
  const [files, setFiles]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [activeTab, setActiveTab]   = useState("vault");
  const [checkin, setCheckin]       = useState("90");

  const token    = localStorage.getItem("token");
  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const maxFiles = user?.maxFileNumber ?? 3;
  const hasReachedLimit = files.length >= maxFiles;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFilesAPI(token);
      setFiles(data.files || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleSave = () => {
    console.log("Saving check-in interval:", checkin === "custom" ? "custom" : checkin);
    alert("Changes saved.");
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-dark-bg text-white">

      {/* ── Left Sidebar ── */}
      <aside className="w-56 min-h-screen bg-dark-card border-r border-white/10 flex flex-col py-8 px-3 flex-shrink-0">
        <div className="text-xs text-gray-500 uppercase tracking-widest px-3 mb-4 font-semibold">
          Menu
        </div>

        <nav className="flex flex-col gap-1">
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  active
                    ? "bg-primary text-white shadow-lg"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon active={active} />
                {label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === "vault" && (
          <VaultPage
            files={files}
            token={token}
            hasReachedLimit={hasReachedLimit}
            onUpgrade={() => setShowUpgrade(true)}
          />
        )}
        {activeTab === "addFolder" && <AddFolderPage />}
        {activeTab === "nominees"  && <NomineesPage />}
        {activeTab === "switch"    && (
          <SwitchPage
            checkin={checkin}
            setCheckin={setCheckin}
            onSave={handleSave}
          />
        )}
      </main>

      {/* ── Upgrade Modal ── */}
      {showUpgrade && (
        <UpgradeModal token={token} onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  );
}
