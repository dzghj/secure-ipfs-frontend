export default function AlertsPanel({ alerts }) {
  return (
    <div className="bg-dark-card p-6 rounded-xl border border-dark-border">
      <h3>Alerts</h3>

      {alerts.length === 0 ? (
        <p className="text-green-400">No issues</p>
      ) : (
        alerts.map((a, i) => (
          <div key={i} className="text-red-400 text-sm">
            {a.type}
          </div>
        ))
      )}
    </div>
  );
}