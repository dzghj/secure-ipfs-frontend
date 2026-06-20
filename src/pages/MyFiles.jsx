import React, { useEffect, useState, useCallback } from "react";
import { fetchFilesAPI } from "../services/api";

import Loader        from "../components/common/Loader";
import UpgradeModal  from "../components/common/UpgradeModal";
import Sidebar       from "../components/files/Sidebar";
import VaultPage     from "../components/files/VaultPage";
import AddFolderPage from "../components/files/AddFolderPage";
import NomineesPage  from "../components/files/NomineesPage";
import SwitchPage    from "../components/files/SwitchPage";

export default function MyFiles() {
  const [files,       setFiles]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [activeTab,   setActiveTab]   = useState("vault");
  const [checkin,     setCheckin]     = useState("90");

  const token           = localStorage.getItem("token");
  const user            = JSON.parse(localStorage.getItem("user") || "{}");
  const maxFiles        = user?.maxFileNumber ?? 3;
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
    <div className="flex h-full w-full bg-dark-bg text-white overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Center content at 80% width */}
        <div className="w-4/5 mx-auto">
          {activeTab === "vault" && (
            <VaultPage
              files={files}
              token={token}
              hasReachedLimit={hasReachedLimit}
              onUpgrade={() => setShowUpgrade(true)}
              user={user}
              onUploadComplete={load}
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
        </div>
      </main>

      {showUpgrade && (
        <UpgradeModal token={token} onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  );
}
