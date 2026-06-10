export default function OddsWidget() {
  return (
    <div className="bg-[var(--wc-surface)] rounded-xl border border-[var(--wc-border)] overflow-hidden shadow-md p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--wc-text-muted)]">Match Odds</span>
        <span className="text-xs font-bold text-white tracking-widest">1XBET</span>
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1 bg-white/5 rounded p-2 text-center relative hover:bg-white/10 transition-colors cursor-pointer">
          <div className="text-[10px] text-[var(--wc-text-muted)] mb-1 font-bold">1</div>
          <div className="text-sm font-bold">1.44</div>
          <span className="absolute top-1 right-1 text-[8px] text-[var(--wc-red)]">▼</span>
        </div>
        <div className="flex-1 bg-white/5 rounded p-2 text-center relative hover:bg-white/10 transition-colors cursor-pointer">
          <div className="text-[10px] text-[var(--wc-text-muted)] mb-1 font-bold">X</div>
          <div className="text-sm font-bold">4.50</div>
          <span className="absolute top-1 right-1 text-[var(--wc-green)] text-[8px]">▲</span>
        </div>
        <div className="flex-1 bg-white/5 rounded p-2 text-center relative hover:bg-white/10 transition-colors cursor-pointer">
          <div className="text-[10px] text-[var(--wc-text-muted)] mb-1 font-bold">2</div>
          <div className="text-sm font-bold">7.50</div>
          <span className="absolute top-1 right-1 text-[var(--wc-green)] text-[8px]">▲</span>
        </div>
      </div>
      
      <div className="text-[9px] text-[var(--wc-text-muted)] text-center mt-3 uppercase tracking-wider">
        Odds subject to change. 18+ Play responsibly.
      </div>
    </div>
  );
}
