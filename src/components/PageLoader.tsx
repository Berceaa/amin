type PageLoaderProps = {
  active: boolean;
};

export default function PageLoader({ active }: PageLoaderProps) {
  return (
    <div
      className={`page-loader fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(255,250,246,0.55)] transition duration-200 ${
        active ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!active}
    >
      <div className="loader-card flex flex-col items-center rounded-[1.5rem] border border-white/70 bg-white/92 px-6 py-5 shadow-[0_16px_36px_rgba(15,23,42,0.10)]">
        <div className="paw-loader-track flex items-center gap-2">
          <span className="paw-loader-step">🐾</span>
          <span className="paw-loader-step paw-loader-step-2">🐾</span>
          <span className="paw-loader-step paw-loader-step-3">🐾</span>
        </div>
        <p className="mt-3 text-[11px] font-black uppercase tracking-[0.24em] text-[#f27128]">Loading</p>
      </div>
    </div>
  );
}
