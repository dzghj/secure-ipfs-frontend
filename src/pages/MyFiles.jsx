import React, { useEffect, useState, useCallback } from "react";
import { fetchFilesAPI, fetchNomineesAPI, fetchCheckinIntervalAPI, saveCheckinIntervalAPI } from "../services/api";

import Loader        from "../components/common/Loader";
import UpgradeModal  from "../components/common/UpgradeModal";
import Sidebar       from "../components/files/Sidebar";
import VaultPage     from "../components/files/VaultPage";
import AddFolderPage from "../components/files/AddFolderPage";
import NomineesPage  from "../components/files/NomineesPage";
import SwitchPage    from "../components/files/SwitchPage";

export default function MyFiles() {
  const [files,           setFiles]           = useState([]);
  const [nominees,        setNominees]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [showUpgrade,     setShowUpgrade]     = useState(false);
  const [activeTab,       setActiveTab]       = useState("vault");
  const [checkin,         setCheckin]         = useState("90");
  const [extraCategories, setExtraCategories] = useState([]);

  const token           = localStorage.getItem("token");
  const user            = JSON.parse(localStorage.getItem("user") || "{}");
  const maxFiles        = user?.maxFileNumber ?? 3;
  const hasReachedLimit = files.length >= maxFiles;

  // Merge categories from files + any manually created ones
  const fileCategories = [...new Set(files.map((f) => f.category || "Personal"))];
  const allCategories  = [...new Set([...fileCategories, ...extraCategories])];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [fileData, nomineeData, checkinData] = await Promise.all([
        fetchFilesAPI(token),
        fetchNomineesAPI(token).catch(() => []),
        fetchCheckinIntervalAPI(token).catch(() => ({ checkinInterval: 90 })),
      ]);
      setFiles(fileData.files || []);
      setNominees(nomineeData || []);
      setCheckin(String(checkinData.checkinInterval || 90));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    try {
      const days = checkin === "custom"
        ? parseInt(document.querySelector('input[type="number"]')?.value || "90", 10)
        : parseInt(checkin, 10);
      await saveCheckinIntervalAPI(token, days);
      alert(`✓ Check-in interval saved: every ${days} days`);
    } catch (err) {
      alert("Failed to save: " + err.message);
    }
  };

  const handleFolderCreated = (categoryName) => {
    setExtraCategories((prev) =>
      prev.includes(categoryName) ? prev : [...prev, categoryName]
    );
    setActiveTab("vault");
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
              nominees={nominees}
              token={token}
              hasReachedLimit={hasReachedLimit}
              onUpgrade={() => setShowUpgrade(true)}
              user={user}
              onUploadComplete={load}
              extraCategories={extraCategories}
            />
          )}
          {activeTab === "addFolder" && (
            <AddFolderPage
              onFolderCreated={handleFolderCreated}
              existingCategories={allCategories}
            />
          )}
          {activeTab === "nominees" && (
            <NomineesPage
              allCategories={allCategories}
              nominees={nominees}
              onNomineesChange={setNominees}
            />
          )}
          {activeTab === "switch" && (
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
