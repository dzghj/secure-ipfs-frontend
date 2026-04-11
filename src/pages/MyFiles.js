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
      <div className="w-64 bg-neutral-900/80 backdrop-blur-md border-r border-neutral-800 p-6 hidden md:block">
        

        <nav className="space-y-3 text-sm">
          <div className="text-gray-400 hover:text-white transition cursor-pointer">
            Dashboard
          </div>
          <div className="text-gray-400 hover:text-white transition cursor-pointer">
            Security
          </div>
          <div className="text-gray-400 hover:text-white transition cursor-pointer">
            AI 
          </div>
          <div className="text-gray-400 hover:text-white transition cursor-pointer">
           Files
          </div>
        </nav>
      </div>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex justify-center">
        <div className="w-full flex flex-col px-4 md:px-6 lg:px-8">

          {/* ===== TOPBAR ===== */}
          <div className="flex justify-between py-4 border-b border-neutral-800">

            <h1 className="text-lg font-semibold">Dashboard</h1>

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
              <div className="text-sm text-gray-400">
                {user?.email || "User"}
              </div>
            </div>
          </div>

          {/* ===== CONTENT ===== */}
          <div className="py-6 space-y-6">
               {/* ===== HERO / PRODUCT INFO ===== */}
<div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl">

{/* Title */}
<h2 className="text-2xl font-bold mb-2">
  🏛 ShadowVault — Enterprise Digital Asset Vault
</h2>

{/* Description */}
<p className="text-gray-400 mb-4">
  Secure, encrypted, and blockchain-verified storage for your most critical legal and ownership documents.
</p>

{/* Divider */}
<div className="border-t border-neutral-700 my-4"></div>

{/* Dead Man Switch */}
<h3 className="text-lg font-semibold mb-2">
  🔐 Dead-Man Switch Protection
</h3>

<p className="text-gray-400 text-sm">
  If enabled, ShadowVault monitors account inactivity. After 30 days a reminder email is sent. After 40 days your designated KeyHolder(s) receive recovery access.
</p>
<div className="lg:col-span-3 bg-neutral-900/80 backdrop-blur-md p-6 rounded-2xl border border-neutral-700 shadow-xl">
               <div className="">
              <AIAssistant token={token} />
              </div>
              </div>
</div>
            {/* Dashboard */}
            <Dashboard
              files={files}
              alerts={alerts}
              user={user}
              onUpgrade={() => setShowUpgrade(true)}
            />

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

           
              {/* FILE LIST */}
              <div className="lg:col-span-3 bg-neutral-900/80 backdrop-blur-md p-6 rounded-2xl border border-neutral-700 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">📁 Files</h3>
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
