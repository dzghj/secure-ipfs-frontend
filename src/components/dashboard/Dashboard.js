import RiskScoreCard from "./RiskScoreCard";
import AlertsPanel from "./AlertsPanel";

export default function Dashboard({ files, alerts, user, onUpgrade }) {
  const max = user?.maxFileNumber || 3;
  const reached = files.length >= max;
  const score = 100 - alerts.length * 10;

  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      <RiskScoreCard score={score} />
      <AlertsPanel alerts={alerts} />

      <div className="bg-neutral-900 p-6 rounded-xl">
        <h3>Capacity</h3>
        <p>{files.length} / {max}</p>

        {reached && (
          <button onClick={onUpgrade} className="bg-yellow-500 mt-3 px-3 py-1">
            Upgrade
          </button>
        )}
      </div>
    </div>
  );
}
