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
      <div className="bg-neutral-900 p-6 rounded-xl w-96">
        <h3 className="mb-4">Upgrade Plan</h3>

        {plans.map(p => (
          <div key={p.id} className="border p-3 mb-2 rounded">
            <div>{p.name}</div>
            <div>{p.maxFiles} files</div>
            <div>${p.price}</div>
          </div>
        ))}

        <button onClick={onClose} className="mt-4 bg-neutral-700 px-3 py-1">
          Close
        </button>
      </div>
    </div>
  );
}