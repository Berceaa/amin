import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MiniMascot() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mascot-shell fixed bottom-5 right-5 z-[70] hidden lg:block">
      {open && (
        <div className="mascot-bubble mb-3 max-w-[220px] rounded-[1.2rem] border border-white/80 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f27128]">Pawsentials</p>
          <p className="mt-1 font-medium">Need help? Browse the best picks for your pet.</p>
          <div className="mt-3 flex items-center gap-2">
            <Link
              to="/products"
              className="inline-flex items-center rounded-full bg-[#f27128] px-3 py-1.5 text-xs font-bold text-white"
            >
              Shop now
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-orange-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="mascot-button relative flex h-[72px] w-[72px] items-center justify-center rounded-full border border-white/80 bg-[linear-gradient(180deg,#fffdfb_0%,#fff4ec_100%)] shadow-[0_16px_36px_rgba(242,113,40,0.18)]"
        aria-label="Mascot helper"
      >
        <span className="mascot-face text-[2rem]">🐶</span>
      </button>
    </div>
  );
}
