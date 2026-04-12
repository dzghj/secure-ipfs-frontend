import { useEffect, useState, useCallback } from "react";
import Dashboard from "../components/dashboard/Dashboard";
import AIAssistant from "../components/ai/AIAssistant";
import FileList from "../components/files/FileList";
import UpgradeModal from "../components/common/UpgradeModal";
import Loader from "../components/common/Loader";
import { fetchFilesAPI } from "../services/api";

export default function MyFiles() {
  const [files, setFiles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFilesAPI(token);
      setFiles(data.files || []);
      setAlerts(data.securityAlerts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">

      {/* ===== SIDEBAR ===== */}
      <div className="w-64 bg-blue-900/80 backdrop-blur-md border-r border-neutral-800 p-6 hidden md:block">
        

        <nav className="space-y-3 text-sm">
          <div className="text-white hover:text-white transition cursor-pointer">
            Dashboard
          </div>
          <div className="text-white hover:text-white transition cursor-pointer">
            Security
          </div>
          <div className="text-white hover:text-white transition cursor-pointer">
            AI 
          </div>
          <div className="text-white hover:text-white transition cursor-pointer">
           Files
          </div>
        </nav>
      </div>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex justify-center">
        <div className="w-full flex flex-col px-4 md:px-6 lg:px-8">

          {/* ===== TOPBAR ===== */}
          <div className="flex justify-between py-4 border-b border-neutral-800">

          <div>
  <h1 className="text-xl font-semibold text-white">
    🏛 ShadowVault— Enterprise Digital Asset Vault
  </h1>
  <p className="text-xs text-gray-400">
  Secure, encrypted, and blockchain-verified storage for your most critical legal and ownership documents.
  </p>
</div>
          

            <div className="flex gap-4">

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="bg-neutral-800 hover:bg-neutral-700 transition px-3 py-1 rounded"
                >
                  🔔
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-neutral-900/90 backdrop-blur-md border border-neutral-700 rounded-xl p-3 text-sm shadow-xl">
                    {alerts.length === 0 ? (
                      <p className="text-green-400">No alerts</p>
                    ) : (
                      alerts.map((a, i) => (
                        <div key={i} className="text-red-400 mb-2">
                          {a.type}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User */}
              <div className="text-sm text-white">
                {user?.email || "User"}
              </div>
            </div>
          </div>

          {/* ===== CONTENT ===== */}
          <div className="py-6 space-y-6">
               {/* ===== HERO / PRODUCT INFO ===== */}
            {/* ===== HERO / PRODUCT INFO ===== */}
<div className="bg-gradient-to-r from-blue-900/40 via-neutral-900 to-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-xl space-y-6">

{/* Title */}


{/* Dead-Man Switch Info */}
<div className="bg-purple-900/30 border border-purple-700 rounded-xl p-4">
  <h3 className="text-sm font-semibold text-purple-300 mb-1">
    🔐 Dead-Man Switch Protection
  </h3>
  <p className="text-xs text-gray-400">
    If enabled, ShadowVault monitors account inactivity. After <span className="text-white">30 days</span> a reminder email is sent. After <span className="text-white">40 days</span> your designated KeyHolder(s) receive recovery access.
  </p>
</div>

{/* ===== STATS ===== */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

  <div className="bg-blue-800 p-4 rounded-xl border border-neutral-700">
    <p className="text-xs text-gray-400">Total Files</p>
    <p className="text-xl font-semibold text-white">{files.length}</p>
  </div>

  <div className="bg-blue-800 p-4 rounded-xl border border-neutral-700">
    <p className="text-xs text-gray-400">Protected Files</p>
    <p className="text-xl font-semibold text-green-400">
      {files.filter(f => f.protectionOn).length}
    </p>
  </div>

  <div className="bg-blue-800 p-4 rounded-xl border border-neutral-700">
    <p className="text-xs text-gray-400">Security Alerts</p>
    <p className="text-xl font-semibold text-red-400">
      {alerts.length}
    </p>
  </div>

</div>

{/* ===== AI Assistant ===== */}
<div className="bg-neutral-900/80 backdrop-blur-md p-4 rounded-xl border-neutral-700">
  <AIAssistant token={token} />
</div>

</div>
            {/* Dashboard */}
            <Dashboard
              files={files}
              alerts={alerts}
              user={user}
              onUpgrade={() => setShowUpgrade(true)}
            />
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

{/* Compliance */}
<div className="bg-neutral-900 p-4 rounded-xl border border-neutral-700">
  <h3 className="text-sm font-semibold mb-3">📑 Compliance Logs</h3>

  <ul className="text-xs text-gray-400 space-y-1">
    <li>✔ SOC2 Audit Ready</li>
    <li>✔ Encryption Verified</li>
    <li>✔ Access Logged</li>
  </ul>
</div>

{/* Role-based access */}
<div className="bg-neutral-900 p-4 rounded-xl border border-neutral-700">
  <h3 className="text-sm font-semibold mb-3">👤 Access Control</h3>

  <p className="text-xs text-gray-400">
    Role: Owner
  </p>

  <p className="text-xs text-green-400 mt-2">
    Full permissions granted
  </p>
</div>

</div>
            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ===== UPGRADE CTA ===== */}
<div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-neutral-700 rounded-xl p-4 flex justify-between items-center">

<div>
              <p className="text-sm text-white font-medium">
                Unlock Enterprise Security Features
              </p>
              <p className="text-xs text-gray-400">
                Advanced monitoring, audit logs, and recovery automation
              </p>
            </div>

            <button
              onClick={() => setShowUpgrade(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
            >
              Upgrade
            </button>

            </div>
              {/* FILE LIST */}
              <div className="lg:col-span-3 bg-neutral-900/80 backdrop-blur-md p-6 rounded-2xl border border-neutral-700 shadow-xl">
              <h3 className="text-lg font-semibold mb-2">
                📁 Vault Records
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Each file is encrypted, blockchain-anchored, and recoverable.
              </p>
                <FileList files={files} token={token} />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showUpgrade && (
        <UpgradeModal
          token={token}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </div>
  );
}
