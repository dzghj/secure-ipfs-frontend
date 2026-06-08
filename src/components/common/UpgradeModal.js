import { useEffect, useState } from "react";

export default function UpgradeModal({ token, onClose }) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch(`/api/upgrade/options`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPlans(data.plans || []));
  }, [token]);

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
      <div className="bg-dark-card p-6 rounded-xl w-96 border border-dark-border shadow-xl">
        <h3 className="mb-4 text-xl font-semibold">Upgrade Plan</h3>

        {plans.map(p => (
          <div key={p.id} className="border border-dark-border p-3 mb-2 rounded bg-dark-bg">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-400">{p.maxFiles} files</div>
            <div className="text-primary font-bold">${p.price}</div>
          </div>
        ))}

        <button onClick={onClose} className="mt-4 w-full bg-dark-bg hover:bg-dark-border border border-dark-border px-3 py-2 rounded font-medium transition">
          Close
        </button>
      </div>
    </div>
  );
}