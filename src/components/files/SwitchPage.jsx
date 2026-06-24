import React, { useState } from "react";

const INTERVAL_OPTIONS = [
  { id: "7",  label: "Every 7 days"  },
  { id: "14", label: "Every 14 days" },
  { id: "30", label: "Every 30 days" },
  { id: "90", label: "Every 90 days" },
];

const HOW_IT_WORKS = [
  "Choose how often you want to confirm your activity in the app.",
  "You must open the app at least once within this period to confirm you are active.",
  "Each successful login resets your check-in timer.",
  "If you do not log in within your selected period, the system marks you as inactive.",
  "Your assigned nominees will then be notified as per your access settings.",
];

export default function SwitchPage({ checkin, setCheckin, onSave }) {
  const [customDays, setCustomDays] = useState("");

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Continuity Switch</h1>
        <p className="text-gray-400 text-sm">Configure how often you confirm your activity.</p>
      </div>

      {/* Status banner */}
      <div className="rounded-2xl mb-8 bg-gradient-to-b from-green-100 to-green-200 p-8 text-center shadow-lg">
        <img src="/image1.png" alt="checked" className="mx-auto w-24 h-24 mb-4" />
        <div className="text-2xl font-bold text-gray-900">Successfully Checked-In!</div>
        <div className="text-sm text-gray-600 mt-2">Your vault is active and secure.</div>
      </div>

      {/* Interval selection */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Change Check-in Interval to</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {INTERVAL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setCheckin(opt.id)}
              className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all font-medium ${
                checkin === opt.id
                  ? "border-primary bg-white text-gray-900 shadow"
                  : "bg-white/10 border-dark-border text-white hover:border-primary"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                  checkin === opt.id
                    ? "border-primary bg-primary"
                    : "border-gray-500 bg-transparent"
                }`}
              />
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom days */}
        <button
          onClick={() => setCheckin("custom")}
          className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all font-medium ${
            checkin === "custom"
              ? "border-primary bg-white text-gray-900 shadow"
              : "bg-white/10 border-dark-border text-white hover:border-primary"
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
              checkin === "custom"
                ? "border-primary bg-primary"
                : "border-gray-500 bg-transparent"
            }`}
          />
          Custom Days
          {checkin === "custom" && (
            <input
              type="number"
              value={customDays}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setCustomDays(e.target.value)}
              placeholder="e.g. 45"
              className="ml-auto w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none text-gray-900 bg-white"
            />
          )}
        </button>
      </div>

      {/* How it works */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">How Check-In Works</h2>
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-5">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary bg-opacity-20 border border-primary border-opacity-30 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed pt-1">{step}</p>
            </div>
          ))}
        </div>

        {/* Nominee re-notification note */}
        <div className="flex items-start gap-3 mt-4 bg-dark-card border border-dark-border rounded-xl px-5 py-4">
          <span className="text-primary flex-shrink-0 mt-0.5">📧</span>
          <p className="text-sm text-gray-400 leading-relaxed">
            If a nominee does not access your files after being notified, the system will
            automatically resend the access link twice — spaced apart like interview reminders —
            to ensure your wishes are never missed.
          </p>
        </div>
      </div>

      <button
        onClick={onSave}
        className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition"
      >
        Save Changes
      </button>
    </div>
  );
}
