export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BrewRequest = {
  brewMethod?: string;
  flavors?: Record<string, number>;
  notes?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function toNumberInRange(value: unknown, min: number, max: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function extractGeminiText(json: any): string {
  const parts: string[] = [];

  const candidates = json?.candidates;
  if (Array.isArray(candidates)) {
    for (const cand of candidates) {
      const contentParts = cand?.content?.parts;
      if (!Array.isArray(contentParts)) continue;
      for (const p of contentParts) {
        if (typeof p?.text === "string") parts.push(p.text);
      }
    }
  }

  return parts.join("\n").trim();
}

function normalizeGeminiModelName(model: string): string {
  return model.trim().replace(/^models\//, "");
}

function uniqStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function parseRetryAfterSeconds(errJson: any): number | undefined {
  const retryDelay = errJson?.error?.details?.find(
    (d: any) => d?.["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
  )?.retryDelay;
  if (typeof retryDelay !== "string") return undefined;
  const m = retryDelay.match(/^(\d+)(s)?$/);
  if (!m) return undefined;
  return Number(m[1]);
}

async function readGeminiError(res: Response): Promise<{
  message: string;
  retryAfterSeconds?: number;
}> {
  const errText = await res.text();
  let message = errText;
  let retryAfterSeconds: number | undefined;

  try {
    const errJson = JSON.parse(errText);
    if (typeof errJson?.error?.message === "string") {
      message = errJson.error.message;
    }
    retryAfterSeconds = parseRetryAfterSeconds(errJson);
  } catch {
    // ignore JSON parse failures
  }

  return { message, retryAfterSeconds };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "Missing GEMINI_API_KEY. Add it to your environment (e.g. .env.local).",
      },
      { status: 500 }
    );
  }

  let body: BrewRequest;
  try {
    body = (await request.json()) as BrewRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const brewMethod = typeof body.brewMethod === "string" ? body.brewMethod : "";
  const notes = typeof body.notes === "string" ? body.notes : "";

  const flavorsRaw = isRecord(body.flavors) ? body.flavors : {};
  const flavors: Record<string, number> = {};
  for (const [k, v] of Object.entries(flavorsRaw)) {
    flavors[k] = toNumberInRange(v, 0, 10);
  }

  if (!brewMethod.trim()) {
    return Response.json(
      { error: "brewMethod is required." },
      { status: 400 }
    );
  }

  const configuredModel = normalizeGeminiModelName(process.env.GEMINI_MODEL ?? "");
  const defaultModel = "gemini-2.5-flash-lite";
  const modelCandidates = uniqStrings([
    configuredModel || defaultModel,
    defaultModel,
    "gemini-2.5-flash",
    "gemini-flash-latest",
    // Deprecated, but kept as a last fallback for older projects
    "gemini-2.0-flash",
  ]);

  const flavorLines = Object.entries(flavors)
    .map(([k, v]) => `- ${k}: ${v}/10`)
    .join("\n");

  const system =
    "You are a professional coffee blending expert (green coffee buyer + roaster + barista). " +
    "Your job is to recommend a practical coffee blend recipe that matches the user's brew method and target flavor intensities. " +
    "Be specific and grounded: use realistic origins/regions, processing methods, typical altitude ranges, and roast profiles that actually exist in specialty coffee. " +
    "Provide a 2-4 component blend with clear ratio percentages (must sum to 100%). " +
    "Tailor for the brew method (e.g., espresso needs solubility and syrupy texture; pour over highlights clarity). " +
    "Avoid brand names, do not invent farms/producer names, and do not claim certainty—state assumptions where needed. " +
    "Most importantly: include an explicit fit assessment that compares your recommendation to the requested flavor targets, calls out tradeoffs, and where it may fall short. " +
    "Output must be concise, plain text, and easy to scan in a small textbox: no Markdown headings, no numbered lists, no long paragraphs.";

  const user = [
    `Brew method: ${brewMethod}`,
    "Desired flavor intensities (0-10):",
    flavorLines || "(none)",
    notes ? `Additional notes: ${notes}` : "Additional notes: (none)",
    "\nFORMAT REQUIREMENTS (follow exactly):",
    "- Plain text only. No Markdown (no ###, no **, no tables).",
    "- Keep it to ~20-30 lines max, short bullets, no fluff.",
    "- Use this exact template and section labels:",
    "",
    "- Insert a blank line between each section block.",
    "BLEND: <1 sentence>",
    "COMPONENTS:",
    "- <Origin/Region> | <Process> | <Altitude range> | role: <short>",
    "- (2-4 total)",
    "RATIOS: <OriginA XX%>, <OriginB YY%>, ... (must sum 100%)",
    "ROAST:",
    "- <OriginA>: <light/med/med-dark> | dev: <short> | 1C: <short>",
    "- <OriginB>: ...",
    "- Overall: <short>",
    "BREW TUNING: <3 bullets max (grind/ratio/temp/time) tailored to brew method>",
    "FIT: <score 0-100> | <1 line targets→expected for top 5 flavors only>",
    "SHORTFALLS: <2-3 bullets; be honest about tradeoffs>",
    "TWEAKS:",
    "- Too bright: <1 line>",
    "- Too flat: <1 line>",
    "- Too bitter: <1 line>",
    "- Too thin: <1 line>",
    "",
    "CONTENT REQUIREMENTS:",
    "- Use realistic coffee origins and processes.",
    "- Ratios must sum to 100%.",
    "- Include roast guidance that a small roaster can act on.",
    "- FIT must explicitly compare requested vs expected (e.g., Chocolate 6→5).",
  ].join("\n");

  let lastError:
    | {
        status: number;
        message: string;
        retryAfterSeconds?: number;
        model: string;
      }
    | undefined;

  for (const model of modelCandidates) {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            role: "system",
            parts: [{ text: system }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: user }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
          },
        }),
      }
    );

    if (geminiRes.ok) {
      const json = await geminiRes.json();
      const text = extractGeminiText(json);

      if (!text) {
        return Response.json(
          {
            error:
              "Gemini returned an empty response. Try adjusting your prompt or model.",
          },
          { status: 502 }
        );
      }

      return Response.json({ recommendation: text, modelUsed: model });
    }

    const { message, retryAfterSeconds } = await readGeminiError(geminiRes);

    lastError = {
      status: geminiRes.status,
      message,
      retryAfterSeconds,
      model,
    };

    const isModelNotFoundOrUnsupported =
      geminiRes.status === 404 &&
      /not\s+found|not\s+supported/i.test(message);

    if (isModelNotFoundOrUnsupported) {
      continue;
    }

    return Response.json(
      {
        error: `Gemini request failed (${geminiRes.status}). ${message}`,
        modelTried: model,
        ...(retryAfterSeconds ? { retryAfterSeconds } : {}),
      },
      {
        status: geminiRes.status,
        headers: retryAfterSeconds
          ? { "Retry-After": String(retryAfterSeconds) }
          : undefined,
      }
    );
  }

  return Response.json(
    {
      error:
        "Gemini model not available for this API key/project. Set GEMINI_MODEL to a model returned by the ListModels API.",
      ...(lastError
        ? { modelTried: lastError.model, details: lastError.message }
        : {}),
    },
    { status: 502 }
  );

  // (unreachable)
}
