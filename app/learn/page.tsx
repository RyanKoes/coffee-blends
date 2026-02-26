import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn: Coffee Flavor Basics | Coffee Blend Builder",
  description:
    "A quick, easy-to-read guide to how roast, brew method, species, processing, and altitude shape flavor.",
};

export default function LearnPage() {
  return (
    <div className="builder-shell">
      <section className="builder-header">
        <h2>Coffee flavor basics</h2>
        <p>
          Your cup is the result of a chain: green coffee (species + origin +
          processing) → roast profile → brew method → your extraction choices.
          Use this page as a quick reference when you’re dialing the Blend
          Builder.
        </p>
        <div className="actions" style={{ marginTop: "1.25rem" }}>
          <Link href="/#builder" className="primary-btn">
            Go to Blend Builder
          </Link>
          <Link href="/#results" className="secondary-btn">
            See Results
          </Link>
        </div>
      </section>

      <div className="builder-grid">
        <section className="panel" aria-label="Roast profiles">
          <h3>Roast profiles</h3>
          <p className="hint" style={{ lineHeight: 1.65 }}>
            Roast is a tradeoff between preserving origin character (floral,
            fruit, bright acidity) and developing caramelization + body (sweet,
            chocolatey, round). As roast gets darker, solubility usually goes up
            (easier to extract), while delicate aromatics often fade.
          </p>

          <div className="field">
            <label>Light</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Higher clarity and acidity; tea-like florals and citrus can pop.
              Can taste sharp or underdeveloped if pushed too light, and often
              needs a tighter brew recipe to avoid sourness.
            </p>
          </div>

          <div className="field">
            <label>Medium</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Balanced sweetness + origin character. A common “sweet spot” for
              pour over and drip where caramel, stone fruit, and chocolate can
              coexist.
            </p>
          </div>

          <div className="field">
            <label>Medium-dark</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              More body and roast sweetness; acidity softens. Great for espresso
              blends that need syrupy texture and reduced sharpness, but can
              begin to cover up florals.
            </p>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>Dark</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Dominant roast flavors (smoke, bitter cocoa, carbon notes).
              Generally lower perceived acidity and less origin detail. Easy to
              over-extract into bitterness.
            </p>
          </div>
        </section>

        <section className="panel" aria-label="Brew methods">
          <h3>Brew methods</h3>
          <p className="hint" style={{ lineHeight: 1.65 }}>
            Brew method changes what you taste because it changes strength,
            extraction, and filtration. Paper filters tend to highlight clarity;
            metal filters and immersion tend to emphasize body.
          </p>

          <div className="field">
            <label>Espresso</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Concentrated and texture-forward. Blends often benefit from more
              solubility and sweetness (many people prefer medium to medium-dark
              roasts). A small portion of higher-impact coffee can add aroma,
              but too much can make the shot sharp.
            </p>
          </div>

          <div className="field">
            <label>Pour over / drip</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Clean, aromatic, and detail-revealing. Washed coffees and lighter
              roasts often shine here. If cups feel thin, use a blend with a bit
              more body-focused component or adjust recipe.
            </p>
          </div>

          <div className="field">
            <label>French press</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Immersion + metal filtration = more oils and heavier mouthfeel.
              Nutty/chocolate notes can feel richer, while high florals may read
              less clear.
            </p>
          </div>

          <div className="field">
            <label>AeroPress</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Very flexible: can mimic a clean filter cup or a heavier,
              espresso-like brew depending on recipe. Great for dialing blends.
            </p>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>Cold brew</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Lower acidity perception and big sweetness/body when done well.
              Fruit can become “jammy” rather than bright.
            </p>
          </div>
        </section>

        <section className="panel" aria-label="Species and processing">
          <h3>Species &amp; processing</h3>
          <p className="hint" style={{ lineHeight: 1.65 }}>
            Species is the plant. Processing is how the fruit is removed from
            the seed. Together they strongly influence sweetness, aroma, and how
            “clean” or “funky” the cup feels.
          </p>

          <div className="field">
            <label>Arabica vs. robusta (high level)</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Arabica is commonly associated with higher aromatics and more
              nuanced acidity. Robusta often brings more caffeine and heavier
              bitterness/body. Many specialty blends are 100% arabica, while
              some espresso styles use a small robusta portion for crema and
              punch.
            </p>
          </div>

          <div className="field">
            <label>Washed</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Typically cleaner, more defined acidity, clearer florals and
              citrus. Often helps “clarity” and “acidity” feel precise.
            </p>
          </div>

          <div className="field">
            <label>Natural</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Often adds fruit sweetness and heavier body (berry, jam, tropical).
              Can also add fermenty notes if pushed. Great when you want “berry”
              or round sweetness.
            </p>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>Honey / pulped natural</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Sits between washed and natural: sweetness and body with cleaner
              structure. Useful for “caramel” and “body” without going too funky.
            </p>
          </div>
        </section>

        <section className="panel" aria-label="Altitude and density">
          <h3>Altitude &amp; density</h3>
          <p className="hint" style={{ lineHeight: 1.65 }}>
            Altitude affects temperature and growing pace. Higher-altitude coffee
            often develops more slowly, which can correlate with denser seeds and
            brighter, more structured acidity.
          </p>

          <div className="field">
            <label>Higher altitude (often ~1500m+)</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              More “sparkle” and complexity: citrus, florals, crisp fruit.
              Roasting can take a bit more energy to develop evenly. Great for
              dialing up “acidity” and “floral,” especially in filter.
            </p>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>Lower altitude (often &lt; ~1200m)</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Often rounder and heavier: nutty, cocoa, caramel. Can be a strong
              “base” component for blends when you want body and sweetness.
            </p>
          </div>
        </section>

        <section className="panel" aria-label="Quick mapping to your flavor dials">
          <h3>Quick mapping to your flavor dials</h3>
          <p className="hint" style={{ lineHeight: 1.65 }}>
            A simple mental model: use one “base” coffee for sweetness/body and
            one “lift” coffee for aroma/brightness. Then adjust roast and brew
            method to land the cup.
          </p>

          <div className="field">
            <label>Want more chocolate + body?</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Try medium to medium-dark roasts; consider lower-altitude,
              body-forward components and/or natural/honey processes.
            </p>
          </div>

          <div className="field">
            <label>Want more citrus/floral + clarity?</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Lean washed + higher-altitude components; keep roast on the
              lighter side; use paper-filter methods to emphasize detail.
            </p>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>Getting bitterness or dryness?</label>
            <p className="hint" style={{ margin: 0, lineHeight: 1.65 }}>
              Often extraction is too high (too fine / too hot / too long) or
              roast is too dark for the method. Coarsen slightly, lower temp, or
              shorten brew time.
            </p>
          </div>

          <div className="actions" style={{ marginTop: "1.25rem" }}>
            <Link href="/#builder" className="primary-btn">
              Build a blend
            </Link>
            <Link href="/" className="secondary-btn">
              Back home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
