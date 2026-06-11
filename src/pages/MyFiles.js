import { useEffect, useState, useCallback } from "react";
import UpgradeModal from "../components/common/UpgradeModal";
import Loader from "../components/common/Loader";
import { fetchFilesAPI } from "../services/api";
import FileList from "../components/files/FileList";

// ── Icons ──────────────────────────────────────────────────────────────────
function IconVault() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <circle cx="12" cy="12" r="3"/>
      <line x1="3" y1="8" x2="21" y2="8"/>
    </svg>
  );
}
function IconAddFolder() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      <line x1="12" y1="11" x2="12" y2="17"/>
      <line x1="9" y1="14" x2="15" y2="14"/>
    </svg>
  );
}
function IconNominees() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      <polygon points="12,2 14.5,7 20,7.6 16,11.4 17.1,17 12,14.3 6.9,17 8,11.4 4,7.6 9.5,7"/>
    </svg>
  );
}
function IconSwitch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}
function IconFolder({ color = "#7c6af7" }) {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <path d="M6 14a4 4 0 0 1 4-4h10l4 5h18a4 4 0 0 1 4 4v19a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V14z" fill={color} opacity="0.85"/>
      <path d="M6 20h40v17a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V20z" fill={color}/>
      <path d="M20 28h12M26 22v12" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}
function IconShieldCheck({ size = 80, color = "#22c997" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path d="M40 8L12 20v20c0 16.6 11.9 32.1 28 35.8C56.1 72.1 68 56.6 68 40V20L40 8z" fill={color}/>
      <path d="M40 8L12 20v20c0 16.6 11.9 32.1 28 35.8C56.1 72.1 68 56.6 68 40V20L40 8z" fill="url(#shieldGrad)"/>
      <polyline points="28,40 37,50 54,32" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="shieldGrad" x1="40" y1="8" x2="40" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38e8b5"/>
          <stop offset="1" stopColor="#22a87a"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
function IconPersonBadge() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#e8f5e9"/>
      <path d="M20 10a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" stroke="#4caf50" strokeWidth="1.8"/>
      <path d="M10 32c0-5.5 4.5-9 10-9s10 3.5 10 9" stroke="#4caf50" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

// ── Folder colours ─────────────────────────────────────────────────────────
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

// ── Tab: Vault ─────────────────────────────────────────────────────────────
function VaultTab({ files, token, hasReachedLimit, onUpgrade }) {
  return (
    <div style={styles.tabContent}>
      <h1 style={styles.pageTitle}>Vault</h1>

      {hasReachedLimit && (
        <div style={styles.limitBanner}>
          <span>You've reached your plan limit.</span>
          <button onClick={onUpgrade} style={styles.upgradeBtn}>Upgrade Plan</button>
        </div>
      )}

      <div style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>📁</span>
          <h3 style={styles.cardTitle}>Vault Records</h3>
        </div>
        <p style={styles.cardSub}>All files are encrypted and stored securely.</p>
        <FileList files={files} token={token} />
        {files.length === 0 && (
          <p style={{ color: "#aaa", fontSize: 14, textAlign: "center", marginTop: 24 }}>
            No files uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Tab: Add Folder ────────────────────────────────────────────────────────
function AddFolderTab() {
  const [categoryName, setCategoryName] = useState("Personal");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState("personal");

  const handleCreate = () => {
    alert(`Folder "${categoryName}" created!`);
  };

  return (
    <div style={styles.tabContent}>
      <h1 style={styles.pageTitle}>Add New Folder</h1>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Category Name</label>
        <input
          style={styles.input}
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
          placeholder="Category Name"
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Description</label>
        <input
          style={styles.input}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Select Folder Colour</label>
        <div style={styles.folderGrid}>
          {FOLDER_TYPES.map(ft => (
            <button
              key={ft.id}
              onClick={() => { setSelected(ft.id); setCategoryName(ft.label); }}
              style={{
                ...styles.folderCell,
                border: selected === ft.id ? "2px solid #1e3a8a" : "2px solid transparent",
                background: selected === ft.id ? "#eef2ff" : "#f5f6fa",
              }}
            >
              <IconFolder color={ft.color} />
              <span style={styles.folderLabel}>{ft.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleCreate} style={styles.primaryBtn}>Create Folder</button>
    </div>
  );
}

// ── Tab: Nominees ──────────────────────────────────────────────────────────
function NomineesTab() {
  const [nominees, setNominees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", relationship: "", access: "full" });

  const handleSave = () => {
    if (!form.name || !form.email) return alert("Name and email are required.");
    setNominees(prev => [...prev, { ...form, id: Date.now() }]);
    setForm({ name: "", email: "", phone: "", relationship: "", access: "full" });
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div style={styles.tabContent}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => setShowForm(false)} style={styles.backBtn}>‹</button>
          <h1 style={{ ...styles.pageTitle, margin: 0 }}>Add New Nominee</h1>
        </div>

        {[
          { label: "Name", key: "name", placeholder: "Enter Name", type: "text" },
          { label: "Email", key: "email", placeholder: "Enter Email", type: "email" },
          { label: "Phone Number", key: "phone", placeholder: "Enter Phone Number", type: "tel" },
          { label: "Relationship", key: "relationship", placeholder: "Enter Relationship", type: "text" },
        ].map(f => (
          <div key={f.key} style={styles.fieldGroup}>
            <label style={styles.label}>{f.label}</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>👤</span>
              <input
                style={styles.inputIconed}
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
              />
            </div>
          </div>
        ))}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Access</label>
          <div style={{ display: "flex", gap: 12 }}>
            {["full", "partial"].map(a => (
              <button
                key={a}
                onClick={() => setForm(p => ({ ...p, access: a }))}
                style={{
                  ...styles.accessBtn,
                  border: form.access === a ? "2px solid #1e3a8a" : "2px solid #d1d5db",
                  background: form.access === a ? "#eef2ff" : "#fff",
                  color: form.access === a ? "#1e3a8a" : "#374151",
                }}
              >
                <span style={{ marginRight: 6 }}>📁</span>
                {a === "full" ? "Full Access" : "Partial Access"}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.infoBanner}>
          <span style={{ marginRight: 10, fontSize: 18 }}>🔒</span>
          Nominees can only access data according to the permissions you assign.
        </div>

        <button onClick={handleSave} style={styles.primaryBtn}>Save Nominee</button>
      </div>
    );
  }

  return (
    <div style={styles.tabContent}>
      <h1 style={styles.pageTitle}>Nominees</h1>

      <div style={styles.card}>
        <h3 style={{ ...styles.cardTitle, color: "#1e3a8a", marginBottom: 8 }}>Nominee Access</h3>
        <p style={{ color: "#555", fontSize: 15, lineHeight: 1.5, marginBottom: 16 }}>
          Add trusted individuals who can access your vault data if you miss a check-in.
        </p>
        <div style={styles.emptyState}>
          <IconPersonBadge />
          <span style={{ color: "#666", fontSize: 15, marginLeft: 12 }}>No nominees added</span>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ ...styles.cardTitle, color: "#1e3a8a", marginBottom: 4 }}>Your Nominees</h3>
            <p style={{ color: "#666", fontSize: 14 }}>People who can access your vault.</p>
          </div>
          <button onClick={() => setShowForm(true)} style={styles.addNomineeBtn}>
            Add Nominee +
          </button>
        </div>

        {nominees.map(n => (
          <div key={n.id} style={styles.nomineeRow}>
            <div style={styles.nomineeAvatar}>{n.name[0].toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 600, color: "#1e293b" }}>{n.name}</div>
              <div style={{ fontSize: 13, color: "#666" }}>{n.email} · {n.relationship}</div>
            </div>
            <span style={{
              marginLeft: "auto", fontSize: 12, padding: "3px 10px",
              borderRadius: 20, background: n.access === "full" ? "#dcfce7" : "#dbeafe",
              color: n.access === "full" ? "#166534" : "#1e40af",
            }}>
              {n.access === "full" ? "Full" : "Partial"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Switch ────────────────────────────────────────────────────────────
function SwitchTab() {
  const [checkin, setCheckin] = useState("90");
  const [customDays, setCustomDays] = useState("");

  const handleSave = () => alert("Check-in interval saved.");

  const options = [
    { id: "7", label: "Every 7 days" },
    { id: "14", label: "Every 14 days" },
    { id: "30", label: "Every 30 days" },
    { id: "90", label: "Every 90 days" },
  ];

  const steps = [
    "Choose how often you want to confirm your activity in the app.",
    "You must open the app at least once within this period to confirm you are active.",
    "Each successful login resets your check-in timer.",
    "If you do not log in within your selected period, the system marks you as inactive.",
    "Your assigned nominees will then be notified as per your access settings.",
  ];

  return (
    <div style={styles.tabContent}>
      <h1 style={styles.pageTitle}>Continuity Switch</h1>

      <div style={styles.checkinBanner}>
        <IconShieldCheck />
        <div style={{ marginTop: 14, fontWeight: 700, fontSize: 18, color: "#1a4a3a" }}>
          Successfully Checked-In!
        </div>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Change Check-in Interval to</label>
        <div style={styles.optionsGrid}>
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => setCheckin(opt.id)}
              style={{
                ...styles.optionBtn,
                border: checkin === opt.id ? "2px solid #1e3a8a" : "2px solid #e5e7eb",
                background: checkin === opt.id ? "#fff" : "#f5f6fa",
                color: "#1e293b",
              }}
            >
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                border: checkin === opt.id ? "5px solid #1e3a8a" : "2px solid #d1d5db",
                display: "inline-block", marginRight: 10, flexShrink: 0,
                background: "#fff",
              }} />
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCheckin("custom")}
          style={{
            ...styles.optionBtn,
            width: "100%",
            marginTop: 10,
            border: checkin === "custom" ? "2px solid #1e3a8a" : "2px solid #e5e7eb",
            background: checkin === "custom" ? "#fff" : "#f5f6fa",
            color: "#1e293b",
          }}
        >
          <span style={{
            width: 18, height: 18, borderRadius: "50%",
            border: checkin === "custom" ? "5px solid #1e3a8a" : "2px solid #d1d5db",
            display: "inline-block", marginRight: 10, flexShrink: 0,
            background: "#fff",
          }} />
          Custom Days
          {checkin === "custom" && (
            <input
              type="number"
              value={customDays}
              onClick={e => e.stopPropagation()}
              onChange={e => setCustomDays(e.target.value)}
              placeholder="e.g. 45"
              style={{
                marginLeft: 12, border: "1px solid #d1d5db",
                borderRadius: 8, padding: "4px 10px", width: 90,
                fontSize: 14, color: "#1e293b",
              }}
            />
          )}
        </button>
      </div>

      <div style={styles.fieldGroup}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>
          How Check-In Works
        </h3>
        <div style={styles.stepCard}>
          {steps.map((s, i) => (
            <div key={i} style={styles.stepRow}>
              <div style={styles.stepNum}>{i + 1}</div>
              <p style={styles.stepText}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} style={styles.primaryBtn}>Save Changes</button>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = {
  root: {
    display: "flex", flexDirection: "column", minHeight: "100vh",
    background: "#f7f8fc", color: "#1e293b", fontFamily: "'Inter', -apple-system, sans-serif",
    maxWidth: 480, margin: "0 auto", position: "relative",
  },
  scrollArea: { flex: 1, overflowY: "auto", paddingBottom: 90 },
  tabContent: { padding: "28px 20px 16px" },
  pageTitle: { fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 24, color: "#0f172a" },

  // bottom nav
  bottomNav: {
    position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
    width: "100%", maxWidth: 480,
    background: "#fff", borderTop: "1px solid #e5e7eb",
    display: "flex", zIndex: 100,
  },
  navItem: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "10px 0 12px",
    background: "none", border: "none", cursor: "pointer",
    borderRight: "1px solid #e5e7eb", gap: 4,
  },
  navLabel: { fontSize: 11, fontWeight: 500 },

  // cards
  card: {
    background: "#fff", borderRadius: 18, padding: "20px 18px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
  },
  cardTitle: { fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 },
  cardSub: { color: "#64748b", fontSize: 13, marginBottom: 16, marginTop: 4 },

  // forms
  fieldGroup: { marginBottom: 22 },
  label: { display: "block", fontSize: 13, color: "#6b7280", marginBottom: 8, fontWeight: 500 },
  input: {
    width: "100%", padding: "14px 16px", fontSize: 15,
    background: "#f1f3f9", border: "none", borderRadius: 12,
    outline: "none", boxSizing: "border-box", color: "#1e293b",
  },
  inputWrapper: {
    display: "flex", alignItems: "center",
    background: "#f1f3f9", borderRadius: 12, padding: "0 16px",
    border: "1.5px solid #e5e7eb",
  },
  inputIcon: { fontSize: 18, marginRight: 10, color: "#94a3b8" },
  inputIconed: {
    flex: 1, padding: "14px 0", fontSize: 15,
    background: "transparent", border: "none", outline: "none", color: "#1e293b",
  },

  // buttons
  primaryBtn: {
    width: "100%", padding: "16px", fontSize: 16, fontWeight: 700,
    background: "#1e3a8a", color: "#fff", border: "none",
    borderRadius: 14, cursor: "pointer", marginTop: 8,
  },
  backBtn: {
    fontSize: 26, color: "#1e3a8a", background: "none",
    border: "none", cursor: "pointer", lineHeight: 1, padding: 0,
  },
  addNomineeBtn: {
    background: "#1e3a8a", color: "#fff", border: "none",
    padding: "12px 20px", borderRadius: 24, fontSize: 14,
    fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
  },
  accessBtn: {
    flex: 1, padding: "12px 10px", borderRadius: 12,
    fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  upgradeBtn: {
    background: "#1e293b", color: "#fff", border: "none",
    padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, marginLeft: 12,
  },

  // nominees
  emptyState: {
    display: "flex", alignItems: "center",
    background: "#f5f6fa", borderRadius: 12, padding: "16px 18px",
  },
  nomineeRow: {
    display: "flex", alignItems: "center", gap: 14,
    background: "#fff", borderRadius: 12, padding: "14px 16px",
    marginTop: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  nomineeAvatar: {
    width: 40, height: 40, borderRadius: "50%",
    background: "#1e3a8a", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 16, flexShrink: 0,
  },

  // info banner
  infoBanner: {
    display: "flex", alignItems: "flex-start",
    background: "#dbeafe", borderRadius: 12, padding: "14px 16px",
    fontSize: 14, color: "#1e40af", lineHeight: 1.5, marginBottom: 16,
  },

  // switch tab
  checkinBanner: {
    background: "linear-gradient(160deg, #ccfbef 0%, #a7f3d0 100%)",
    borderRadius: 18, padding: "30px 20px", textAlign: "center",
    marginBottom: 24, boxShadow: "0 2px 8px rgba(34,200,150,0.15)",
  },
  optionsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  optionBtn: {
    display: "flex", alignItems: "center",
    padding: "14px 16px", borderRadius: 12,
    fontSize: 15, fontWeight: 500, cursor: "pointer", textAlign: "left",
  },
  stepCard: {
    background: "#f1f3f9", borderRadius: 14, padding: "18px 16px",
  },
  stepRow: { display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" },
  stepNum: {
    width: 26, height: 26, borderRadius: "50%",
    background: "#e2e8f0", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 13, fontWeight: 700,
    color: "#475569", flexShrink: 0, marginTop: 1,
  },
  stepText: { fontSize: 14, color: "#374151", lineHeight: 1.55, margin: 0 },

  // limit banner
  limitBanner: {
    background: "#fef3c7", color: "#92400e",
    padding: "14px 16px", borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 20, fontSize: 14,
  },

  // folder grid
  folderGrid: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
  },
  folderCell: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "14px 8px", borderRadius: 14, cursor: "pointer",
    background: "#f5f6fa",
  },
  folderLabel: { fontSize: 13, color: "#374151", marginTop: 8, fontWeight: 500 },
};

// ── Main Component ─────────────────────────────────────────────────────────
const TABS = [
  { id: "vault",      label: "Vault",      Icon: IconVault },
  { id: "addFolder",  label: "Add Folder", Icon: IconAddFolder },
  { id: "nominees",   label: "Nominees",   Icon: IconNominees },
  { id: "switch",     label: "Switch",     Icon: IconSwitch },
];

export default function MyFiles() {
  const [activeTab, setActiveTab] = useState("vault");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
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

  if (loading) return <Loader />;

  return (
    <div style={styles.root}>
      <div style={styles.scrollArea}>
        {activeTab === "vault" && (
          <VaultTab
            files={files}
            token={token}
            hasReachedLimit={hasReachedLimit}
            onUpgrade={() => setShowUpgrade(true)}
          />
        )}
        {activeTab === "addFolder" && <AddFolderTab />}
        {activeTab === "nominees" && <NomineesTab />}
        {activeTab === "switch" && <SwitchTab />}
      </div>

      {/* Bottom Nav */}
      <nav style={styles.bottomNav}>
        {TABS.map(({ id, label, Icon }, i) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                ...styles.navItem,
                borderRight: i < TABS.length - 1 ? "1px solid #e5e7eb" : "none",
                color: active ? "#1e3a8a" : "#9ca3af",
              }}
            >
              <Icon />
              <span style={{ ...styles.navLabel, color: active ? "#1e3a8a" : "#9ca3af", fontWeight: active ? 700 : 500 }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {showUpgrade && (
        <UpgradeModal token={token} onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  );
}
