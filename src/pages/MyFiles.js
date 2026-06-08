import { useEffect, useState, useCallback } from "react";
import UpgradeModal from "../components/common/UpgradeModal";
import Loader from "../components/common/Loader";
import { fetchFilesAPI } from "../services/api";

export default function MyFiles() {
  const [files, setFiles] = useState([]);
  const [alerts, setAlerts] = useState([]);
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

  // Continuity switch state
  const [checkin, setCheckin] = useState("90");
  const [customDays, setCustomDays] = useState(30);

  const handleSave = async () => {
    // Save action placeholder
    console.log("Saving check-in interval:", checkin === "custom" ? customDays : checkin);
    alert("Changes saved.");
  };

  return (
    <div className="flex min-h-screen bg-dark-bg text-white flex-col">
      <div className="max-w-2xl mx-auto w-full px-6 py-10">
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">Continuity Switch</h1>

        {/* Status Card */}
        <div className="rounded-2xl overflow-hidden mb-8 bg-gradient-to-b from-green-100 to-green-200 p-8 text-center shadow">
          <img src="/image1.png" alt="checked" className="mx-auto w-24 h-24 mb-4" />
          <div className="text-2xl font-semibold text-gray-900">Successfully Checked-In!</div>
        </div>

        {/* Options */}
        <div className="mb-6">
          <h2 className="text-lg text-gray-800 mb-4">Change Check-in Interval to</h2>

          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "7", label: "Every 7 days" },
              { id: "14", label: "Every 14 days" },
              { id: "30", label: "Every 30 days" },
              { id: "90", label: "Every 90 days" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setCheckin(opt.id)}
                className={`w-full text-left p-4 rounded-xl border ${checkin === opt.id ? 'border-primary bg-white' : 'bg-white/30 border-transparent'} text-gray-900 font-medium`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${checkin === opt.id ? 'bg-primary' : 'bg-white'} w-5 h-5 rounded-full border`} />
                  <div>{opt.label}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={() => setCheckin('custom')}
              className={`w-full p-4 rounded-xl ${checkin === 'custom' ? 'border border-primary bg-white' : 'bg-white/30'} text-gray-900 text-left`}
            >
              <div className="flex items-center gap-3">
                <div className={`${checkin === 'custom' ? 'bg-primary' : 'bg-white'} w-5 h-5 rounded-full border`} />
                <div>Custom Days {checkin === 'custom' && <span className="ml-2 text-sm text-gray-600">({customDays} days)</span>}</div>
              </div>
            </button>
          </div>
        </div>

        {/* How Check-In Works */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-800 mb-3">How Check-In Works</h3>
          <div className="p-4 bg-white/10 rounded-xl border border-white/5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-semibold">1</div>
              <div className="text-sm text-gray-300">Choose how often you want to confirm your activity in the app.</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <button onClick={handleSave} className="w-full bg-primary text-white py-4 rounded-xl text-lg font-semibold">Save Changes</button>
        </div>

        {/* Nominees card */}
        <div className="mt-6 p-6 bg-white/5 rounded-2xl border border-white/5">
          <h3 className="text-xl font-semibold text-gray-900">Nominee Access</h3>
          <p className="text-sm text-gray-600 mt-2">Add trusted individuals who can access your vault data if you miss a check-in.</p>

          <div className="mt-4 p-4 bg-white rounded-lg text-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-green-50 flex items-center justify-center">👤</div>
            <div>No nominees added</div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="bg-primary text-white px-6 py-2 rounded-full">Add Nominee +</button>
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
    </p>

    <p className="text-gray-400 text-sm mb-4">
      You have reached your current plan limit. Upgrade to add more protected records.
    </p>

    <button
      onClick={() => openUpgradeModal()}
      className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium px-6 py-2 rounded-lg transition"
    >
      🚀 Upgrade Plan
    </button>
  </div>
) : (
  /* NORMAL UPLOAD */
  <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">

    <p className="text-sm text-gray-400 mb-4">
      Drag & drop or select a file. All uploads are encrypted and permanently anchored.
    </p>

    {/* Center uploader */}
    <div className="flex justify-center">
      <FileUploader
        token={token}
        user={user}
        onUploadComplete={load}
      />
    </div>

    <p className="text-xs text-gray-500 mt-4">
      🔒 Files are encrypted client-side and cannot be altered after anchoring.
    </p>
  </div>
)}
</div>
            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


      <div className="lg:col-span-3 bg-dark-card p-6 rounded-2xl border border-dark-border shadow-xl">
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
