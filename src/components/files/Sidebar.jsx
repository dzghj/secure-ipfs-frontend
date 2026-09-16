import React from "react";

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

// "Add Folder" is no longer a nav item — it's triggered from a button inside
// the "My Vault" card on the Vault page itself.
const TRAILING_TABS = [
  { id: "nominees", label: "Nominees", Icon: IconNominees },
  { id: "switch",   label: "Switch",   Icon: IconSwitch   },
];

export default function Sidebar({ activeTab, onTabChange }) {
  const vaultActive = activeTab === "vault";

  return (
    <aside
      style={{ width: "220px", minWidth: "220px" }}
      className="h-screen sticky top-0 bg-dark-card border-r border-dark-border flex flex-col py-8 px-3"
    >
      {/* Logo / title */}
      <div className="px-3 mb-8">
        <div className="text-sm font-bold text-white mb-0.5">LegacyChain</div>
        <div className="text-xs text-gray-500">My Files</div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {/* Vault */}
        <button
          onClick={() => onTabChange("vault")}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all text-left w-full ${
            vaultActive
              ? "bg-primary text-white shadow-lg"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <IconVault active={vaultActive} />
          Vault
          {vaultActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70" />
          )}
        </button>

        {TRAILING_TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
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
    </aside>
  );
}
