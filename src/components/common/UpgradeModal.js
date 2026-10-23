import { useEffect, useRef, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

// Loads the PayPal JS SDK once and reuses it across modal opens/closes —
// safe to call repeatedly, only the first call actually injects the script.
let paypalSdkPromise = null;
function loadPaypalSdk() {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (paypalSdkPromise) return paypalSdkPromise;

  paypalSdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(PAYPAL_CLIENT_ID)}&currency=USD`;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject(new Error("Failed to load PayPal"));
    document.body.appendChild(script);
  });
  return paypalSdkPromise;
}

// Renders PayPal's own Buttons widget for one paid plan. Kept as a
// dedicated component (remounted via `key` whenever the selected plan
// changes) so each selection gets its own clean .render() call instead of
// trying to reuse/clear a previous widget instance in the same container.
function PaypalButtons({ plan, token, onSuccess, onError }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadPaypalSdk()
      .then((paypal) => {
        if (cancelled || !containerRef.current) return;
        paypal.Buttons({
          createOrder: async () => {
            const res = await fetch(`${API_BASE_URL}/api/upgrade/create-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ planId: plan.id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to start checkout");
            return data.orderId;
          },
          onApprove: async (data) => {
            const res = await fetch(`${API_BASE_URL}/api/upgrade/capture-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ orderId: data.orderID }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Payment could not be completed");
            onSuccess();
          },
          onError: (err) => onError(err.message || "PayPal checkout failed"),
        }).render(containerRef.current);
      })
      .catch((err) => onError(err.message));

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.id]);

  if (!PAYPAL_CLIENT_ID) {
    return <div className="text-xs text-yellow-500 mt-2">Payment isn't configured yet.</div>;
  }
  return <div ref={containerRef} className="mt-2" />;
}

export default function UpgradeModal({ token, onClose, onUpgraded, mandatory = false }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscribingId, setSubscribingId] = useState(null);
  const [selectedPaidPlan, setSelectedPaidPlan] = useState(null);

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

  const handleSelectFreePlan = async (plan) => {
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

  const handlePaymentSuccess = () => {
    onUpgraded?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
      <div className="bg-dark-card p-6 rounded-xl w-96 border border-dark-border shadow-xl">
        <h3 className="mb-4 text-xl font-semibold">{mandatory ? "Choose a Plan to Get Started" : "Upgrade Plan"}</h3>
        {mandatory && (
          <p className="text-sm text-gray-400 mb-4">
            Select and pay for a plan to activate your vault — uploads are locked until you do.
          </p>
        )}

        {loading && <div className="text-sm text-gray-400 mb-3">Loading plans…</div>}
        {error && <div className="text-sm text-red-400 mb-3">{error}</div>}

        {plans.map(p => (
          <div key={p.id} className="border border-dark-border p-3 mb-2 rounded bg-dark-bg">
            <button
              type="button"
              disabled={subscribingId !== null}
              onClick={() => p.price > 0 ? setSelectedPaidPlan(p) : handleSelectFreePlan(p)}
              className="w-full text-left disabled:opacity-50"
            >
              <div className="font-semibold">
                {p.name}{subscribingId === p.id ? " — upgrading…" : ""}
              </div>
              <div className="text-sm text-gray-400">
                {p.maxFiles >= 999999 ? "Unlimited files per folder" : `${p.maxFiles} files per folder`}
              </div>
              <div className="text-primary font-bold">${p.price}</div>
            </button>

            {selectedPaidPlan?.id === p.id && (
              <PaypalButtons
                key={p.id}
                plan={p}
                token={token}
                onSuccess={handlePaymentSuccess}
                onError={setError}
              />
            )}
          </div>
        ))}

        {!mandatory && (
          <button onClick={onClose} disabled={subscribingId !== null} className="mt-4 w-full bg-dark-bg hover:bg-dark-border border border-dark-border px-3 py-2 rounded font-medium transition disabled:opacity-50">
            Close
          </button>
        )}
      </div>
    </div>
  );
}
