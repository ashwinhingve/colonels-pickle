import { useState } from "react";

/* ─────────────────────────────────────────────────────────
   COLONEL'S PICKLE — ProductCard Reference Implementation
   Design System: Rajasthani Heritage Premium
   Fonts: Playfair Display / Lora / Mukta
   Palette: Crimson #B91C1C · Saffron #D97706 · Cream #FDF8F0
───────────────────────────────────────────────────────── */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,600&family=Lora:ital,wght@0,400;0,500;1,400&family=Mukta:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --crimson:       #B91C1C;
    --crimson-dark:  #7F1D1D;
    --saffron:       #D97706;
    --saffron-light: #FEF3C7;
    --cream:         #FDF8F0;
    --green:         #166534;
    --green-light:   #DCFCE7;
    --text:          #1C1917;
    --muted:         #78716C;
    --border:        #E7E5E4;
    --white:         #FFFFFF;
  }

  /* ── Fonts ── */
  .f-display { font-family: 'Playfair Display', Georgia, serif; }
  .f-serif   { font-family: 'Lora', Georgia, serif; }
  .f-ui      { font-family: 'Mukta', system-ui, sans-serif; }

  /* ── Page shell ── */
  .page {
    min-height: 100vh;
    background: var(--cream);
    padding: 48px 24px 80px;
    font-family: 'Mukta', system-ui, sans-serif;
  }

  /* ── Section eyebrow ── */
  .eyebrow {
    font-family: 'Mukta', sans-serif;
    font-size: 11px;
    font-weight: 700;
    color: var(--crimson);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    margin-bottom: 8px;
    text-align: center;
  }

  /* ── Section heading ── */
  .section-heading {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 800;
    color: var(--text);
    text-align: center;
    position: relative;
    display: inline-block;
  }
  .section-heading::after {
    content: '';
    display: block;
    width: 52px;
    height: 3px;
    background: linear-gradient(90deg, var(--crimson), var(--saffron));
    border-radius: 2px;
    margin: 10px auto 0;
  }

  /* ── Card grid ── */
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    max-width: 900px;
    margin: 40px auto 0;
  }

  /* ── ProductCard ── */
  .card {
    background: var(--white);
    border-radius: 16px;
    border: 1px solid var(--border);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.28s cubic-bezier(.4,0,.2,1), box-shadow 0.28s ease;
    cursor: default;
  }
  .card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.13);
  }

  /* ── Card header (colored) ── */
  .card-header {
    position: relative;
    height: 152px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  /* Rajasthani ring pattern overlay */
  .card-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.07;
    pointer-events: none;
  }

  /* Jar image / emoji */
  .card-icon {
    font-size: 58px;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.22));
    position: relative;
    z-index: 1;
    user-select: none;
  }

  /* Product badge (Bestseller / Organic / New) */
  .badge-product {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 2;
    border-radius: 100px;
    padding: 3px 10px;
    font-family: 'Mukta', sans-serif;
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    line-height: 1.5;
  }

  /* "No Preservatives ✓" badge — MANDATORY on every card */
  .badge-np {
    position: absolute;
    bottom: 9px;
    right: 9px;
    z-index: 2;
    background: rgba(22,101,52,0.88);
    color: #fff;
    border-radius: 100px;
    padding: 3px 9px;
    font-family: 'Mukta', sans-serif;
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }

  /* ── Card body ── */
  .card-body {
    padding: 15px 16px 18px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .product-name {
    font-family: 'Playfair Display', serif;
    font-size: 15.5px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
    margin-bottom: 3px;
  }

  .product-meta {
    font-family: 'Mukta', sans-serif;
    font-size: 11.5px;
    color: var(--muted);
    margin-bottom: 9px;
  }

  .product-desc {
    font-family: 'Lora', serif;
    font-size: 12.5px;
    color: #57534E;
    line-height: 1.65;
    flex: 1;
    margin-bottom: 14px;
  }

  /* ── Variant selector ── */
  .variant-label {
    font-family: 'Mukta', sans-serif;
    font-size: 10px;
    font-weight: 700;
    color: var(--muted);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 7px;
  }

  .variant-row {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }

  .variant-pill {
    border: 1.5px solid var(--border);
    border-radius: 5px;
    padding: 3px 10px;
    font-family: 'Mukta', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #57534E;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.16s, background 0.16s, color 0.16s;
    line-height: 1.6;
  }
  .variant-pill:hover {
    border-color: var(--crimson);
    color: var(--crimson);
  }
  .variant-pill.active {
    border-color: var(--crimson);
    background: var(--crimson);
    color: #fff;
  }

  /* ── Price + CTA row ── */
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  .price-block {}
  .price-amount {
    font-family: 'Mukta', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: var(--crimson);
    line-height: 1;
  }
  .price-weight {
    font-family: 'Mukta', sans-serif;
    font-size: 10.5px;
    color: var(--muted);
    margin-top: 1px;
  }

  /* Add to cart button */
  .btn-cart {
    border: 2px solid var(--crimson);
    border-radius: 8px;
    padding: 9px 17px;
    font-family: 'Mukta', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    white-space: nowrap;
    line-height: 1;
  }
  .btn-cart.idle {
    background: var(--crimson);
    color: #fff;
  }
  .btn-cart.idle:hover {
    background: var(--crimson-dark);
    border-color: var(--crimson-dark);
    transform: translateY(-1px);
  }
  .btn-cart.added {
    background: var(--green);
    border-color: var(--green);
    color: #fff;
  }

  /* ── Cart toast notification ── */
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes toastOut {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(-8px); }
  }
  .toast {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--text);
    color: #fff;
    padding: 11px 22px;
    border-radius: 100px;
    font-family: 'Mukta', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.22);
    animation: toastIn 0.3s ease forwards;
    z-index: 999;
    white-space: nowrap;
  }
  .toast.leaving {
    animation: toastOut 0.25s ease forwards;
  }
  .toast-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4ADE80;
    flex-shrink: 0;
  }

  /* ── Cart count bubble (header mock) ── */
  @keyframes bounce {
    0%,100% { transform: scale(1); }
    40%      { transform: scale(1.35); }
    70%      { transform: scale(0.88); }
  }
  .cart-bubble {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 6px 16px;
    font-family: 'Mukta', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
  }
  .cart-count {
    background: var(--crimson);
    color: #fff;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
  }
  .cart-count.bounce { animation: bounce 0.35s ease; }

  /* ── Design token legend ── */
  .legend {
    max-width: 900px;
    margin: 52px auto 0;
    padding: 24px 28px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 14px;
  }
  .legend-title {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 16px;
  }
  .legend-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  .swatch {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .swatch-dot {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    flex-shrink: 0;
    border: 1px solid rgba(0,0,0,0.06);
  }
  .swatch-name {
    font-family: 'Mukta', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.3;
  }
  .swatch-hex {
    font-family: 'Mukta', sans-serif;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.04em;
  }

  /* ── Font specimen ── */
  .type-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }
  .type-sample {
    padding: 14px 0 0;
  }
  .type-label {
    font-family: 'Mukta', sans-serif;
    font-size: 10px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }
`;

/* ─── Product data ─── */
const PRODUCTS = [
  {
    id: 1,
    name: "Chhuhara Adrak",
    nameHindi: "छुहारा अदरक",
    sub: "Dry Ginger & Date Pickle",
    desc: "Sun-dried dates with fresh ginger and our 24-spice masala in cold-pressed wooden mustard oil.",
    badge: "Bestseller",
    badgeColor: "#B45309",
    cardBg: "#7C2D12",
    icon: "🫙",
    variants: [
      { w: "100g", p: 149 }, { w: "250g", p: 349 },
      { w: "500g", p: 649 }, { w: "1kg", p: 1298 },
    ],
  },
  {
    id: 2,
    name: "Organic Gulkand",
    nameHindi: "ऑर्गेनिक गुलकंद",
    sub: "Rose Petal Preserve",
    desc: "Pure petals from organic Pushkar rose farms — sun-cooked, sweet, floral, zero preservatives.",
    badge: "Organic",
    badgeColor: "#9D174D",
    cardBg: "#831843",
    icon: "🌹",
    variants: [
      { w: "100g", p: 149 }, { w: "250g", p: 299 },
    ],
  },
  {
    id: 3,
    name: "Adrak Haldi Nimbu",
    nameHindi: "अदरक हल्दी नींबू",
    sub: "Ginger Turmeric Lemon Pickle",
    desc: "Bold ginger, healing turmeric, and tangy lemon — a spoonful of health in natural mustard oil.",
    badge: "New",
    badgeColor: "#166534",
    cardBg: "#713F12",
    icon: "🌿",
    variants: [
      { w: "100g", p: 109 }, { w: "250g", p: 249 },
      { w: "500g", p: 459 }, { w: "1kg", p: 918 },
    ],
  },
];

/* ─── Rajasthani SVG pattern ─── */
function JaliPattern({ id }) {
  return (
    <svg className="card-pattern" width="100%" height="100%">
      <defs>
        <pattern id={id} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M18 2 L34 18 L18 34 L2 18 Z" fill="none" stroke="#fff" strokeWidth="0.8"/>
          <circle cx="18" cy="18" r="7" fill="none" stroke="#fff" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`}/>
    </svg>
  );
}

/* ─── ProductCard ─── */
function ProductCard({ product, onAdd }) {
  const [sel, setSel] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product, product.variants[sel]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const v = product.variants[sel];

  return (
    <div className="card">
      {/* Colored header */}
      <div className="card-header" style={{ background: `linear-gradient(145deg, ${product.cardBg}, ${product.cardBg}CC)` }}>
        <JaliPattern id={`jali-${product.id}`} />

        {/* Product badge */}
        <span className="badge-product" style={{ background: product.badgeColor }}>
          {product.badge}
        </span>

        {/* Jar icon */}
        <span className="card-icon">{product.icon}</span>

        {/* No Preservatives — mandatory */}
        <span className="badge-np">No Preservatives ✓</span>
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="product-name f-display">{product.name}</div>
        <div className="product-meta f-ui">{product.nameHindi} · {product.sub}</div>
        <p className="product-desc f-serif">{product.desc}</p>

        {/* Variant selector */}
        <div className="variant-label">Select Size</div>
        <div className="variant-row">
          {product.variants.map((variant, i) => (
            <button
              key={variant.w}
              className={`variant-pill${sel === i ? " active" : ""}`}
              onClick={() => setSel(i)}
            >
              {variant.w}
            </button>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="card-footer">
          <div className="price-block">
            <div className="price-amount f-ui">₹{v.p.toLocaleString("en-IN")}</div>
            <div className="price-weight f-ui">for {v.w}</div>
          </div>
          <button
            className={`btn-cart ${added ? "added" : "idle"}`}
            onClick={handleAdd}
          >
            {added ? "✓ Added" : "+ Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Toast ─── */
function Toast({ item, onDone }) {
  const [leaving, setLeaving] = useState(false);

  useState(() => {
    const t1 = setTimeout(() => setLeaving(true), 2000);
    const t2 = setTimeout(onDone, 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  });

  return (
    <div className={`toast${leaving ? " leaving" : ""}`}>
      <span className="toast-dot"/>
      <span className="f-ui">{item.name} ({item.variant}) added to cart</span>
    </div>
  );
}

/* ─── Design token legend ─── */
const SWATCHES = [
  { name: "Crimson", hex: "#B91C1C", bg: "#B91C1C" },
  { name: "Crimson Dark", hex: "#7F1D1D", bg: "#7F1D1D" },
  { name: "Saffron", hex: "#D97706", bg: "#D97706" },
  { name: "Saffron Bright", hex: "#F59E0B", bg: "#F59E0B" },
  { name: "Cream BG", hex: "#FDF8F0", bg: "#FDF8F0" },
  { name: "Earth Brown", hex: "#92400E", bg: "#92400E" },
  { name: "No-Pres Green", hex: "#166534", bg: "#166534" },
  { name: "Text Primary", hex: "#1C1917", bg: "#1C1917" },
];

/* ─── Main App ─── */
export default function App() {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [cartBounce, setCartBounce] = useState(false);

  const onAdd = (product, variant) => {
    setCart(prev => {
      const key = `${product.id}-${variant.w}`;
      const ex = prev.find(i => i.key === key);
      return ex
        ? prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { key, name: product.name, variant: variant.w, price: variant.p, qty: 1 }];
    });
    setToast({ name: product.name, variant: variant.w });
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
  };

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="page">
      <style>{CSS}</style>

      {/* Cart bubble (mini header mockup) */}
      <div style={{ display: "flex", justifyContent: "flex-end", maxWidth: 900, margin: "0 auto 32px" }}>
        <div className="cart-bubble">
          <span className="f-ui" style={{ fontSize: 13, color: "#78716C" }}>Cart</span>
          <span className={`cart-count f-ui${cartBounce ? " bounce" : ""}`}>
            {totalItems}
          </span>
          {totalItems > 0 && (
            <span className="f-ui" style={{ fontSize: 12, color: "#78716C" }}>
              · ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <p className="eyebrow">OUR ACHAAR COLLECTION</p>
        <h2 className="section-heading f-display">Signature Homemade Pickles</h2>
        <p className="f-serif" style={{ color: "#78716C", fontSize: 15, marginTop: 14, lineHeight: 1.7 }}>
          Each jar crafted in small batches with a mother&apos;s love,<br/>
          24 premium whole spices &amp; zero artificial preservatives.
        </p>
      </div>

      {/* Product grid */}
      <div className="grid">
        {PRODUCTS.map(p => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </div>

      {/* Design token legend */}
      <div className="legend">
        <div className="legend-title f-display">Design Tokens — Quick Reference</div>

        <div className="legend-grid">
          {SWATCHES.map(s => (
            <div key={s.hex} className="swatch">
              <div className="swatch-dot" style={{ background: s.bg }}/>
              <div>
                <div className="swatch-name f-ui">{s.name}</div>
                <div className="swatch-hex f-ui">{s.hex}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Font specimens */}
        <div className="type-grid">
          <div className="type-sample">
            <div className="type-label f-ui">Display — Playfair Display</div>
            <div className="f-display" style={{ fontSize: 22, fontWeight: 800, color: "#1C1917", lineHeight: 1.2 }}>
              माँ का प्यार
            </div>
            <div className="f-display" style={{ fontSize: 16, fontStyle: "italic", color: "#78716C", marginTop: 4 }}>
              Ghar Ka Achar
            </div>
          </div>
          <div className="type-sample">
            <div className="type-label f-ui">Body — Lora Serif</div>
            <div className="f-serif" style={{ fontSize: 14, color: "#57534E", lineHeight: 1.7 }}>
              Authentic homemade pickles crafted with 24 premium whole spices and cold-pressed mustard oil.
            </div>
          </div>
          <div className="type-sample">
            <div className="type-label f-ui">UI / Hindi — Mukta</div>
            <div className="f-ui" style={{ fontSize: 18, fontWeight: 700, color: "#B91C1C" }}>₹1,298</div>
            <div className="f-ui" style={{ fontSize: 13, color: "#78716C", marginTop: 4 }}>SELECT SIZE · BESTSELLER</div>
            <div className="f-ui" style={{ fontSize: 15, fontWeight: 600, color: "#1C1917", marginTop: 4 }}>
              छुहारा अदरक अचार
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast item={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
