export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-cp-cream">
      <span className="animate-float text-5xl">🫙</span>
      <div className="mt-4 h-8 w-8 animate-spin rounded-full border-2 border-cp-border border-t-cp-crimson" />
      <p className="mt-4 font-sans text-sm text-cp-text-muted">Loading…</p>
    </div>
  );
}
