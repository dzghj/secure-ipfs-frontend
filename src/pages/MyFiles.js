import { useEffect, useState , useCallback} from "react";
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
    <div className="p-10 bg-neutral-950 text-white">

      <Dashboard
        files={files}
        alerts={alerts}
        user={user}
        onUpgrade={() => setShowUpgrade(true)}
      />

      <AIAssistant token={token} />

      <FileList files={files} token={token} />

      {showUpgrade && (
        <UpgradeModal
          token={token}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </div>
  );
}
