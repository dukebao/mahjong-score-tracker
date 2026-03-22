"use client";

import Header from "@/components/common/Header";
import { RULESET_OPTIONS } from "@/lib/constants";
import { useGameStore } from "@/store/useGameStore";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { initialize, initialized, settings, updateSettings } = useGameStore();
  const [ruleset, setRuleset] = useState(settings.defaultRuleset);
  const [startingScore, setStartingScore] = useState(
    String(settings.defaultStartingScore)
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (initialized) {
      setRuleset(settings.defaultRuleset);
      setStartingScore(String(settings.defaultStartingScore));
    }
  }, [initialized, settings]);

  if (!initialized) return null;

  return (
    <main className="mx-auto max-w-md p-4">
      <Header title="Settings" subtitle="Default app preferences" />

      <div className="grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Default Ruleset</span>
          <select
            value={ruleset}
            onChange={(e) => setRuleset(e.target.value as typeof ruleset)}
            className="rounded-xl border px-3 py-2"
          >
            {RULESET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Default Starting Score</span>
          <input
            type="number"
            inputMode="numeric"
            value={startingScore}
            onChange={(e) => setStartingScore(e.target.value)}
            className="rounded-xl border px-3 py-2"
          />
        </label>

        <button
          onClick={() =>
            updateSettings({
              defaultRuleset: ruleset,
              defaultStartingScore: Number(startingScore) || 25000,
            })
          }
          className="rounded-xl bg-black px-4 py-3 text-white"
        >
          Save Settings
        </button>
      </div>
    </main>
  );
}