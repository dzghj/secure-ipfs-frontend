import { useEffect, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function UpgradeModal({ token, onClose, onUpgraded }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscribingId, setSubscribingId] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/upgrade/options`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load plans");
        return res.json();
      })
      .then(data => setPlans(data.plans || []))
      .catch(() => setError("Couldn't load plans. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSelectPlan = async (plan) => {
    setSubscribingId(plan.id);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/upgrade/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: plan.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upgrade failed");
      onUpgraded?.();
      onClose();
    } catch (err) {
      setError(err.message || "Upgrade failed. Please try again.");
    } finally {
      setSubscribingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
      <div className="bg-dark-card p-6 rounded-xl w-96 border border-dark-border shadow-xl">
        <h3 className="mb-4 text-xl font-semibold">Upgrade Plan</h3>

        {loading && <div className="text-sm text-gray-400 mb-3">Loading plans…</div>}
        {error && <div className="text-sm text-red-400 mb-3">{error}</div>}

        {plans.map(p => (
          <button
            key={p.id}
            type="button"
            disabled={subscribingId !== null}
            onClick={() => handleSelectPlan(p)}
            className="w-full text-left border border-dark-border p-3 mb-2 rounded bg-dark-bg hover:border-primary transition disabled:opacity-50"
          >
            <div className="font-semibold">
              {p.name}{subscribingId === p.id ? " — upgrading…" : ""}
            </div>
            <div className="text-sm text-gray-400">
              {p.maxFiles >= 999999 ? "Unlimited files per folder" : `${p.maxFiles} files per folder`}
            </div>
            <div className="text-primary font-bold">${p.price}</div>
          </button>
        ))}

        <button onClick={onClose} disabled={subscribingId !== null} className="mt-4 w-full bg-dark-bg hover:bg-dark-border border border-dark-border px-3 py-2 rounded font-medium transition disabled:opacity-50">
          Close
        </button>
      </div>
    </div>
  );
}