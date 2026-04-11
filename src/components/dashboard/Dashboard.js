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

      <div className="bg-blue-800 p-6 rounded-xl">
        <h3>Capacity</h3>
        <p>{files.length} / {max}</p>

        {reached && (
          <button onClick={onUpgrade} className="bg-yellow-500 mt-3 px-3 py-1">
            Upgrade
          </button>
        )}
      </div>
      <div className="bg-blue-800 p-6 rounded-xl">
        <h3>Capacity</h3>
        <p>{files.length} / {max}</p>

        {reached && (
          <button onClick={onUpgrade} className="bg-yellow-500 mt-3 px-3 py-1">
            Upgrade
          </button>
        )}
      </div>
      <div className="bg-blue-800 p-6 rounded-xl">
        <h3>Capacity</h3>
        <p>{files.length} / {max}</p>

        {reached && (
          <button onClick={onUpgrade} className="bg-yellow-500 mt-3 px-3 py-1">
            Upgrade
          </button>
        )}
      </div>
    
     
               {/* AI Insights */}
               <div className="bg-blue-900/80 backdrop-blur-md p-6 rounded-2xl border border-neutral-700 shadow-xl">
                <h3 className="text-lg font-semibold mb-3">🧠 AI Insights</h3>

                <p className="text-sm text-gray-400 mb-3">
                  Auto analysis of your vault security.
                </p>

                <ul className="text-sm space-y-2">
                  {/*
                  {alerts.length === 0 ? (
                    <li className="text-green-400">✔ No risks detected</li>
                  ) : (
                    alerts.map((a, i) => (
                      <li key={i} className="text-yellow-400">
                        ⚠ {a.type}
                      </li>
                    ))
                  )}

                  <li className="text-blue-400">
                    📊 Files stored: {files.length}
                    </li>*/}
                </ul>
              </div>
    </div>
    
  );
}
