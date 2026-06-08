import { useEffect, useState, useCallback } from "react";
import UpgradeModal from "../components/common/UpgradeModal";
import Loader from "../components/common/Loader";
import { fetchFilesAPI } from "../services/api";
import FileList from "../components/files/FileList";

export default function MyFiles() {
  const [files, setFiles] = useState([]);
  //const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const [checkin, setCheckin] = useState("90");
  //const [customDays, setCustomDays] = useState(30);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const maxFiles = user?.maxFileNumber ?? 3;
  const hasReachedLimit = files.length >= maxFiles;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFilesAPI(token);
      setFiles(data.files || []);
     // setAlerts(data.securityAlerts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    console.log(
      "Saving check-in interval:",
      checkin === "custom" ? customDays : checkin
    );
    alert("Changes saved.");
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-dark-bg text-white flex-col">
      <div className="max-w-2xl mx-auto w-full px-6 py-10">

        {/* HEADER */}
        <h1 className="text-2xl font-semibold text-center mb-6">
          Continuity Switch
        </h1>

        {/* STATUS */}
        <div className="rounded-2xl mb-8 bg-gradient-to-b from-green-100 to-green-200 p-8 text-center shadow">
          <img src="/image1.png" alt="checked" className="mx-auto w-24 h-24 mb-4" />
          <div className="text-2xl font-semibold text-gray-900">
            Successfully Checked-In!
          </div>
        </div>

        {/* CHECK-IN OPTIONS */}
        <div className="mb-6">
          <h2 className="text-lg mb-4">Change Check-in Interval</h2>

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
                className={`p-4 rounded-xl border ${
                  checkin === opt.id
                    ? "border-primary bg-white"
                    : "bg-white/20 border-transparent"
                } text-gray-900`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCheckin("custom")}
            className={`mt-4 w-full p-4 rounded-xl ${
              checkin === "custom"
                ? "border border-primary bg-white"
                : "bg-white/20"
            } text-gray-900`}
          >
            Custom Days {checkin === "custom" && `(${customDays})`}
          </button>
        </div>

        {/* SAVE */}
        <button
          onClick={handleSave}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold mb-8"
        >
          Save Changes
        </button>

        {/* NOMINEES */}
        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-8">
          <h3 className="text-xl font-semibold">Nominee Access</h3>
          <p className="text-sm text-gray-400 mt-2">
            Add trusted individuals for emergency access.
          </p>

          <div className="mt-4 p-4 bg-white rounded-lg text-gray-700">
            No nominees added
          </div>

          <div className="mt-6 flex justify-end">
            <button className="bg-primary text-white px-6 py-2 rounded-full">
              Add Nominee +
            </button>
          </div>
        </div>

        {/* FILE LIMIT WARNING */}
        {hasReachedLimit ? (
          <div className="bg-yellow-600 text-black p-4 rounded-xl text-center">
            You reached your plan limit.
            <button
              onClick={() => setShowUpgrade(true)}
              className="ml-3 bg-black text-white px-4 py-2 rounded-lg"
            >
              Upgrade Plan
            </button>
          </div>
        ) : (
          <div className="bg-dark-card p-6 rounded-xl text-center border">
            <p className="text-sm text-gray-400 mb-4">
              Upload encrypted files securely.
            </p>
          </div>
        )}

        {/* FILES */}
        <div className="mt-8 bg-dark-card p-6 rounded-2xl border">
          <h3 className="text-lg font-semibold mb-2">📁 Vault Records</h3>
          <p className="text-sm text-gray-400 mb-4">
            Encrypted and stored securely.
          </p>

          <FileList files={files} token={token} />
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