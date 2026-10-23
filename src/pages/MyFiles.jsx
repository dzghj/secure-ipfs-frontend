import React, { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchFilesAPI, fetchNomineesAPI, fetchCheckinIntervalAPI, saveCheckinIntervalAPI, fetchFoldersAPI, createFolderAPI } from "../services/api";
import { myFilesText } from "../i18n/myFilesText";

import Loader        from "../components/common/Loader";
import UpgradeModal  from "../components/common/UpgradeModal";
import Sidebar       from "../components/files/Sidebar";
import VaultPage     from "../components/files/VaultPage";
import AddFolderPage from "../components/files/AddFolderPage";
import NomineesPage  from "../components/files/NomineesPage";
import SwitchPage    from "../components/files/SwitchPage";

export default function MyFiles() {
  const { lang } = useOutletContext();
  const t = myFilesText[lang];
  const [files,           setFiles]           = useState([]);
  const [nominees,        setNominees]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  // Tracks only the very first load — load() also runs after every
  // upload/delete (via onUploadComplete/onDeleted) to refresh data, and we
  // don't want those background refreshes to unmount the whole page behind
  // <Loader/>. Unmounting VaultPage resets its internal `selectedCategory`
  // state, which is what was kicking the user back to the vault grid
  // instead of staying on the folder they were in.
  const [hasLoadedOnce,   setHasLoadedOnce]   = useState(false);
  const [showUpgrade,     setShowUpgrade]     = useState(false);
  const [activeTab,       setActiveTab]       = useState("vault");
  const [checkin,         setCheckin]         = useState("90");
  const [extraCategories, setExtraCategories] = useState([]);
  // Per-folder tier limit (Basic/Plus/Premium), from /api/myfiles — replaces
  // the old account-wide file-count check, which didn't match how limits
  // actually work (5/10/unlimited files per folder, not per account).
  const [plan,            setPlan]            = useState({ name: "Basic", maxFilesPerFolder: 5, unlimited: false, noPlanSelected: false });
  const token           = localStorage.getItem("token");
  const user            = JSON.parse(localStorage.getItem("user") || "{}");

  // Merge categories from files + any manually created ones
  const fileCategories = [...new Set(files.map((f) => f.category || "Personal"))];
  const allCategories  = [...new Set([...fileCategories, ...extraCategories])];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [fileData, nomineeData, checkinData, folderData] = await Promise.all([
        fetchFilesAPI(token),
        fetchNomineesAPI(token).catch(() => []),
        fetchCheckinIntervalAPI(token).catch(() => ({ checkinInterval: 90 })),
        fetchFoldersAPI(token).catch(() => []),
      ]);
      setFiles(fileData.files || []);
      if (fileData.plan) setPlan(fileData.plan);
      setNominees(nomineeData || []);
      setCheckin(String(checkinData.checkinInterval || 90));
      setExtraCategories((folderData || []).map((f) => f.name));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setHasLoadedOnce(true);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // No free tier any more — a user with no plan selected yet (new signup,
  // or an old account whose plan row got removed) can't upload until they
  // pay, so surface the gate immediately rather than letting them discover
  // it only when an upload fails. Re-checked on every load() (including
  // after a successful upgrade), not just once on mount.
  useEffect(() => {
    if (plan.noPlanSelected) setShowUpgrade(true);
  }, [plan.noPlanSelected]);

  const handleSave = async () => {
    try {
      const days = checkin === "custom"
        ? parseInt(document.querySelector('input[type="number"]')?.value || "90", 10)
        : parseInt(checkin, 10);
      await saveCheckinIntervalAPI(token, days);
      alert(t.alerts.checkinSaved(days));
    } catch (err) {
      alert(t.alerts.saveFailed(err.message));
    }
  };

  const handleFolderCreated = async (categoryName) => {
    try {
      await createFolderAPI(token, categoryName);
      setExtraCategories((prev) =>
        prev.includes(categoryName) ? prev : [...prev, categoryName]
      );
    } catch (err) {
      console.error("Failed to save folder:", err);
    }
    setActiveTab("vault");
  };

  if (loading && !hasLoadedOnce) return <Loader />;

  return (
    <div className="flex h-full w-full bg-dark-bg text-white overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} t={t.sidebar} />

      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Center content at 80% width */}
        <div className="w-4/5 mx-auto">
          {activeTab === "vault" && (
            <VaultPage
              files={files}
              nominees={nominees}
              token={token}
              plan={plan}
              onUpgrade={() => setShowUpgrade(true)}
              user={user}
              onUploadComplete={load}
              extraCategories={extraCategories}
              onAddFolder={() => setActiveTab("addFolder")}
              t={t.vault}
              folderCardT={t.folderCard}
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
        <UpgradeModal
          token={token}
          onClose={() => setShowUpgrade(false)}
          onUpgraded={load}
          mandatory={plan.noPlanSelected}
        />
      )}
    </div>
  );
}
