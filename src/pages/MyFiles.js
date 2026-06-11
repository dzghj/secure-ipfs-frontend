import { useEffect, useState, useCallback } from "react";
import UpgradeModal from "../components/common/UpgradeModal";
import Loader from "../components/common/Loader";
import { fetchFilesAPI } from "../services/api";
import FileList from "../components/files/FileList";

// ─── Icons ────────────────────────────────────────────────────────────────────

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

// ─── Folder data ──────────────────────────────────────────────────────────────

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

function FolderSvg({ color }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path d="M4 12a3 3 0 0 1 3-3h9l3 4h17a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V12z"
        fill={color} opacity="0.75" />
      <path d="M4 18h36v14a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V18z" fill={color} />
    </svg>
  );
}

// ─── Tab: Vault ───────────────────────────────────────────────────────────────

function VaultPage({ files, token, hasReachedLimit, onUpgrade }) {
  return (
    <div className="w-full px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Vault</h1>
          <p className="text-gray-400 text-sm">{files.length} document{files.length !== 1 ? "s" : ""} secured</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-primary bg-opacity-20 border border-primary rounded-lg text-primary text-sm font-medium">
            🔐 Encrypted
          </div>
        </div>
      </div>

      {/* Plan limit warning */}
      {hasReachedLimit && (
        <div className="bg-yellow-600 text-black p-4 rounded-xl text-center mb-6 flex items-center justify-between">
          <span className="font-medium">You've reached your plan limit.</span>
          <button
            onClick={onUpgrade}
            className="ml-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Security badge */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary to-primary-dark rounded-xl text-white text-center font-semibold text-sm">
        🛡️ End-to-End Encrypted &nbsp;·&nbsp; AES-256 &nbsp;·&nbsp; Zero Knowledge
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Files",  value: files.length,                  icon: "📁" },
          { label: "Encrypted",    value: files.length,                  icon: "🔒" },
          { label: "Storage Used", value: `${files.length * 2 || 0} MB`, icon: "💾" },
        ].map((s, i) => (
          <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-4 text-center hover:border-primary transition">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-primary">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Files list */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">📁 Vault Records</h3>
          <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-dark-border">
            Encrypted &amp; Secured
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-5">
          All files are protected with military-grade AES-256 encryption.
        </p>

        <FileList files={files} token={token} />

        {files.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🗄️</div>
            <p className="text-gray-400 mb-2">No files uploaded yet.</p>
            <p className="text-xs text-gray-500">Your encrypted files will appear here once uploaded.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Add Folder ──────────────────────────────────────────────────────────

function AddFolderPage() {
  const [categoryName, setCategoryName] = useState("Personal");
  const [description,  setDescription]  = useState("");
  const [selected,     setSelected]     = useState("personal");

  return (
    <div className="w-full px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Add New Folder</h1>
        <p className="text-gray-400 text-sm">Organise your vault with custom categories.</p>
      </div>

      <div className="max-w-2xl">
        {/* Category Name */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block font-medium">Category Name</label>
          <input
            className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-primary transition"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
            placeholder="e.g. Personal, Medical, Legal..."
          />
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="text-sm text-gray-400 mb-2 block font-medium">Description</label>
          <input
            className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-primary transition"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        {/* Colour picker */}
        <div className="mb-8">
          <label className="text-sm text-gray-400 mb-3 block font-medium">Select Folder Colour</label>
          <div className="grid grid-cols-3 gap-3">
            {FOLDER_TYPES.map(ft => (
              <button
                key={ft.id}
                onClick={() => { setSelected(ft.id); setCategoryName(ft.label); }}
                className={`flex flex-col items-center py-5 px-2 rounded-2xl border-2 transition-all hover:border-primary ${
                  selected === ft.id
                    ? "border-primary bg-dark-card"
                    : "border-dark-border bg-dark-card bg-opacity-50"
                }`}
              >
                <FolderSvg color={ft.color} />
                <span className="text-sm text-gray-300 mt-2 font-medium">{ft.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => alert(`Folder "${categoryName}" created!`)}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition"
        >
          ✨ Create Folder
        </button>
      </div>
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
      <div className="w-full px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setShowForm(false)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-dark-border text-primary hover:bg-white/5 transition text-xl font-bold"
          >
            ‹
          </button>
          <div>
            <h1 className="text-3xl font-bold">Add New Nominee</h1>
            <p className="text-gray-400 text-sm">Grant vault access to a trusted person.</p>
          </div>
        </div>

        <div className="max-w-2xl">
          {[
            { label: "Name",         key: "name",         placeholder: "Enter Name",         type: "text"  },
            { label: "Email",        key: "email",        placeholder: "Enter Email",        type: "email" },
            { label: "Phone Number", key: "phone",        placeholder: "Enter Phone Number", type: "tel"   },
            { label: "Relationship", key: "relationship", placeholder: "e.g. Spouse, Sibling, Lawyer", type: "text" },
          ].map(f => (
            <div key={f.key} className="mb-5">
              <label className="text-sm text-gray-400 mb-2 block font-medium">{f.label}</label>
              <div className="flex items-center bg-dark-card border border-dark-border rounded-xl px-4 focus-within:border-primary transition">
                <span className="text-gray-500 mr-3 text-lg">👤</span>
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

          {/* Access level */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-3 block font-medium">Access Level</label>
            <div className="flex gap-3">
              {[
                { id: "full",    label: "Full Access",    desc: "All folders & files" },
                { id: "partial", label: "Partial Access", desc: "Selected folders only" },
              ].map(a => (
                <button
                  key={a.id}
                  onClick={() => setForm(p => ({ ...p, access: a.id }))}
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

          {/* Info notice */}
          <div className="flex items-start gap-3 bg-primary bg-opacity-10 border border-primary border-opacity-30 rounded-xl p-4 mb-6 text-sm text-gray-300">
            <span className="text-xl flex-shrink-0">🔒</span>
            Nominees can only access data according to the permissions you assign. You can update or revoke access at any time.
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

  return (
    <div className="w-full px-8 py-10">
      {/* Header */}
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

      {/* Nominee Access info card */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8 hover:border-primary transition">
        <h3 className="text-xl font-semibold text-primary mb-2">Nominee Access</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          Add trusted individuals who can access your vault data if you miss a check-in.
          They will be notified based on your Continuity Switch settings.
        </p>

        {nominees.length === 0 ? (
          <div className="flex items-center gap-4 bg-dark-bg border border-dark-border rounded-xl p-4">
            <div className="w-11 h-11 rounded-xl bg-primary bg-opacity-10 border border-primary border-opacity-20 flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <p className="text-sm text-gray-300 font-medium">No nominees added yet</p>
              <p className="text-xs text-gray-500 mt-0.5">Add trusted individuals to protect your vault.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {nominees.map(n => (
              <div key={n.id} className="flex items-center gap-4 bg-dark-bg border border-dark-border rounded-xl p-4 hover:border-primary transition">
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                  {n.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">{n.name}</div>
                  <div className="text-xs text-gray-400 truncate">{n.email} · {n.relationship}</div>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold flex-shrink-0 ${
                  n.access === "full"
                    ? "bg-emerald-500 bg-opacity-20 text-emerald-400 border border-emerald-500 border-opacity-30"
                    : "bg-blue-500 bg-opacity-20 text-blue-400 border border-blue-500 border-opacity-30"
                }`}>
                  {n.access === "full" ? "✓ Full" : "◑ Partial"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security note */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-5">
        <h4 className="font-semibold mb-3 flex items-center gap-2"><span>🛡️</span> How Nominee Access Works</h4>
        <div className="space-y-3">
          {[
            { icon: "✓", text: "Nominees are notified only when you miss a check-in deadline." },
            { icon: "✓", text: "You control exactly which folders each nominee can access." },
            { icon: "✓", text: "You can update or remove nominees at any time." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start text-sm text-gray-400">
              <span className="text-primary flex-shrink-0 mt-0.5">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
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
    <div className="w-full px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Continuity Switch</h1>
        <p className="text-gray-400 text-sm">Configure how often you confirm your activity.</p>
      </div>

      {/* Status banner — matches reference image */}
      <div className="rounded-2xl mb-8 bg-gradient-to-b from-green-100 to-green-200 p-8 text-center shadow-lg">
        <img src="/image1.png" alt="checked" className="mx-auto w-24 h-24 mb-4" />
        <div className="text-2xl font-bold text-gray-900">Successfully Checked-In!</div>
        <div className="text-sm text-gray-600 mt-2">Your vault is active and secure.</div>
      </div>

      {/* Interval options */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Change Check-in Interval to</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { id: "7",  label: "Every 7 days"  },
            { id: "14", label: "Every 14 days" },
            { id: "30", label: "Every 30 days" },
            { id: "90", label: "Every 90 days" },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setCheckin(opt.id)}
              className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all font-medium ${
                checkin === opt.id
                  ? "border-primary bg-white text-gray-900 shadow"
                  : "bg-white/10 border-dark-border text-white hover:border-primary"
              }`}
            >
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                checkin === opt.id
                  ? "border-primary bg-primary"
                  : "border-gray-500 bg-transparent"
              }`} />
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom days */}
        <button
          onClick={() => setCheckin("custom")}
          className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all font-medium ${
            checkin === "custom"
              ? "border-primary bg-white text-gray-900 shadow"
              : "bg-white/10 border-dark-border text-white hover:border-primary"
          }`}
        >
          <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
            checkin === "custom" ? "border-primary bg-primary" : "border-gray-500 bg-transparent"
          }`} />
          Custom Days
          {checkin === "custom" && (
            <input
              type="number"
              value={customDays}
              onClick={e => e.stopPropagation()}
              onChange={e => setCustomDays(e.target.value)}
              placeholder="e.g. 45"
              className="ml-auto w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none text-gray-900 bg-white"
            />
          )}
        </button>
      </div>

      {/* How check-in works */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">How Check-In Works</h2>
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-5">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary bg-opacity-20 border border-primary border-opacity-30 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed pt-1">{s}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onSave}
        className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition"
      >
        Save Changes
      </button>
    </div>
  );
}

// ─── Sidebar tabs config ──────────────────────────────────────────────────────

const TABS = [
  { id: "vault",     label: "Vault",      Icon: IconVault,     emoji: "🗄️"  },
  { id: "addFolder", label: "Add Folder", Icon: IconAddFolder, emoji: "📁"  },
  { id: "nominees",  label: "Nominees",   Icon: IconNominees,  emoji: "👥"  },
  { id: "switch",    label: "Switch",     Icon: IconSwitch,    emoji: "🛡️" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyFiles() {
  const [files,       setFiles]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [activeTab,   setActiveTab]   = useState("vault");
  const [checkin,     setCheckin]     = useState("90");

  const token       = localStorage.getItem("token");
  const user        = JSON.parse(localStorage.getItem("user") || "{}");
  const maxFiles    = user?.maxFileNumber ?? 3;
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
    console.log("Saving check-in interval:", checkin);
    alert("Changes saved.");
  };

  if (loading) return <Loader />;

  return (
    // Use the same outer wrapper pattern as Main.js: min-h-screen bg-dark-bg text-white
    // `overflow-hidden` on root + `overflow-y-auto` on main prevents layout shift
    <div className="flex min-h-screen bg-dark-bg text-white overflow-hidden">

      {/* ── Left Sidebar ── fixed width, never shrinks ── */}
      <aside
        style={{ width: "220px", minWidth: "220px" }}
        className="h-screen sticky top-0 bg-dark-card border-r border-dark-border flex flex-col py-8 px-3"
      >
        {/* Branding */}
        <div className="px-3 mb-8">
          <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
            SecureVault
          </div>
          <div className="text-xs text-gray-600">My Files</div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all text-left w-full ${
                  active
                    ? "bg-primary text-white shadow-lg"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon active={active} />
                {label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom info */}
        <div className="px-3 mt-6">
          <div className="bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-xl p-3 text-xs text-gray-400">
            <div className="text-primary font-semibold mb-1">🔐 AES-256</div>
            All files encrypted
          </div>
        </div>
      </aside>

      {/* ── Main Content — flex-1 + min-w-0 prevents shrinking ── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
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
