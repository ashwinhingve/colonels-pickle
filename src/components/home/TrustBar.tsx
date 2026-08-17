const TRUST_ITEMS = [
  { icon: "🧪", title: "Zero Preservatives", sub: "No chemicals, ever" },
  { icon: "🫙", title: "Cold Press Oils", sub: "Kachi ghani wooden press" },
  { icon: "⭐", title: "FSSAI Certified", sub: "Safe & trusted" },
  { icon: "🧂", title: "Rock & Black Salt", sub: "No table salt used" },
  { icon: "🌿", title: "24 Whole Spices", sub: "Sun-dried & freshly ground" },
  { icon: "💎", title: "Afghani Hing", sub: "Premium ₹30,000/kg" },
];

export function TrustBar() {
  return (
    <section className="border-b border-cp-border bg-white py-5">
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 px-4 md:grid-cols-6">
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center gap-1 text-center"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-sans text-sm font-bold text-cp-text">
              {item.title}
            </span>
            <span className="font-sans text-xs text-cp-text-muted">
              {item.sub}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustBar;
