export default function AlertsPanel({ alerts }) {
  return (
    <div className="bg-neutral-900 p-6 rounded-xl">
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