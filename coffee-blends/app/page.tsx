"use client";

import { useMemo, useState } from "react";

type BrewMethod =
  | "Espresso"
  | "Pour Over"
  | "Drip"
  | "French Press"
  | "AeroPress"
  | "Cold Brew";

type FlavorKey =
  | "Chocolate"
  | "Caramel"
  | "Nutty"
  | "Berry"
  | "Citrus"
  | "Floral"
  | "Spice"
  | "Body"
  | "Acidity";

const BREW_METHODS: BrewMethod[] = [
  "Espresso",
  "Pour Over",
  "Drip",
  "French Press",
  "AeroPress",
  "Cold Brew",
];

const FLAVORS: { key: FlavorKey; hint: string }[] = [
  { key: "Chocolate", hint: "Cocoa, dark chocolate, fudge" },
  { key: "Caramel", hint: "Brown sugar, caramel, toffee" },
  { key: "Nutty", hint: "Almond, hazelnut, peanut" },
  { key: "Berry", hint: "Strawberry, blueberry, jammy" },
  { key: "Citrus", hint: "Lemon, orange, bright acidity" },
  { key: "Floral", hint: "Jasmine, tea-like aromatics" },
  { key: "Spice", hint: "Cinnamon, clove, warm spice" },
  { key: "Body", hint: "Mouthfeel / weight" },
  { key: "Acidity", hint: "Brightness / sparkle" },
];

function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function formatRecommendationForDisplay(text: string): string {
  const rawLines = text.replace(/\r\n/g, "\n").split("\n");

  const lines: string[] = [];
  for (const line of rawLines) {
    // Normalize trailing whitespace and collapse excessive blank lines later.
    lines.push(line.replace(/[ \t]+$/g, ""));
  }

  const sectionLabel = /^(BLEND|COMPONENTS|RATIOS|ROAST|BREW TUNING|FIT|SHORTFALLS|TWEAKS):\s*/;
  const out: string[] = [];

  for (const line of lines) {
    const isSection = sectionLabel.test(line);
    const prev = out.at(-1) ?? "";

    if (isSection && out.length > 0 && prev.trim() !== "") {
      out.push("");
    }

    out.push(line);
  }

  // Collapse 3+ blank lines to max 2.
  const collapsed: string[] = [];
  let blankRun = 0;
  for (const line of out) {
    if (line.trim() === "") {
      blankRun += 1;
      if (blankRun <= 2) collapsed.push("");
      continue;
    }
    blankRun = 0;
    collapsed.push(line);
  }

  return collapsed.join("\n").trim();
}

export default function Home() {
  const [brewMethod, setBrewMethod] = useState<BrewMethod>("Pour Over");
  const [notes, setNotes] = useState<string>(
    "I like sweet, balanced cups; avoid harsh bitterness."
  );
  const [flavors, setFlavors] = useState<Record<FlavorKey, number>>({
    Chocolate: 6,
    Caramel: 6,
    Nutty: 4,
    Berry: 3,
    Citrus: 3,
    Floral: 2,
    Spice: 2,
    Body: 5,
    Acidity: 4,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string>("");

  const payload = useMemo(() => {
    return {
      brewMethod,
      flavors,
      notes,
    };
  }, [brewMethod, flavors, notes]);

  const displayRecommendation = useMemo(() => {
    return recommendation ? formatRecommendationForDisplay(recommendation) : "";
  }, [recommendation]);

  async function onGenerate() {
    setIsLoading(true);
    setError(null);
    setRecommendation("");

    try {
      const res = await fetch("/api/blend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as
        | { recommendation: string }
        | { error: string };

      if (!res.ok) {
        const message = "error" in data ? data.error : "Request failed.";
        throw new Error(message);
      }

      if (!("recommendation" in data) || !data.recommendation) {
        throw new Error("No recommendation returned.");
      }

      setRecommendation(data.recommendation);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function onReset() {
    setBrewMethod("Pour Over");
    setNotes("I like sweet, balanced cups; avoid harsh bitterness.");
    setFlavors({
      Chocolate: 6,
      Caramel: 6,
      Nutty: 4,
      Berry: 3,
      Citrus: 3,
      Floral: 2,
      Spice: 2,
      Body: 5,
      Acidity: 4,
    });
    setError(null);
    setRecommendation("");
  }

  return (
    <div className="builder-shell">
      <section className="builder-header" id="builder">
        <h2>Build your blend</h2>
        <p>
          Pick a brew method and dial in the flavor notes you want. Then generate
          a blend recommendation (origins, roast level, altitude, processing,
          and suggested ratios) tailored to your cup.
        </p>
      </section>

      <div className="builder-grid">
        <section className="panel" aria-label="Inputs">
          <h3>Your preferences</h3>

          <div className="field">
            <label>Brew method</label>
            <div className="segmented" role="group" aria-label="Brew method">
              {BREW_METHODS.map((method) => (
                <button
                  key={method}
                  type="button"
                  aria-pressed={brewMethod === method}
                  onClick={() => setBrewMethod(method)}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Flavor dial</label>
            <p className="hint">0 = not present, 10 = very prominent</p>
          </div>

          {FLAVORS.map(({ key, hint }) => (
            <div className="field" key={key}>
              <label>
                {key} <span className="hint">— {hint}</span>
              </label>
              <div className="slider-row">
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={flavors[key]}
                  onChange={(e) =>
                    setFlavors((prev) => ({
                      ...prev,
                      [key]: clampInt(Number(e.target.value), 0, 10),
                    }))
                  }
                  aria-label={`${key} intensity`}
                />
                <div className="pill" aria-hidden>
                  {flavors[key]}
                </div>
              </div>
            </div>
          ))}

          <div className="field">
            <label>Anything else?</label>
            <textarea
              className="text-input"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Example: prefer lighter roasts; love washed coffees; avoid very funky naturals"
            />
          </div>

          <div className="actions">
            <button
              type="button"
              className="primary-btn"
              onClick={onGenerate}
              disabled={isLoading}
            >
              {isLoading ? "Generating…" : "Generate blend"}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={onReset}
              disabled={isLoading}
            >
              Reset
            </button>
          </div>

          {error ? (
            <p className="hint" style={{ color: "#B96D40" }}>
              {error}
            </p>
          ) : null}
        </section>

        <section className="panel" aria-label="Output" id="results">
          <h3>Recommendation</h3>
          <div className="result-box">
            {recommendation ? (
              <div className="result">{displayRecommendation}</div>
            ) : (
              <p className="hint">
                Your blend recommendation will show up here.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
