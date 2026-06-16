import type { Metadata } from 'next';
import { MatchGrid } from '@/components/sections/MatchGrid';

export const metadata: Metadata = {
  title: 'WC2026 Match Schedule | All 104 Games Live',
  description: 'View the complete schedule for the FIFA World Cup 2026. Filter by groups, dates, and venues across USA, Canada, and Mexico.',
  alternates: { canonical: '/schedule' },
};

export default function SchedulePage() {
  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)]">
      {/* SEO text */}
      <div className="sr-only">
        <h1>FIFA World Cup 2026 Match Schedule</h1>
        <p>Complete match schedule for the 2026 FIFA World Cup. View all 104 matches, group stage to the final, across host cities in USA, Canada, and Mexico. Check kick-off times and results.</p>
      </div>

      {/* Schedule Page Monetization Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col md:flex-row gap-6 items-center">
        <a 
          href="https://www.effectivecpmnetwork.com/steh40ys?key=c3817b02a6ce5ba1e04b14695f562abc" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full md:w-1/3 py-4 bg-gradient-to-r from-[var(--wc-red)] to-red-600 text-white font-bold text-lg rounded-xl text-center shadow-[0_0_20px_rgba(232,0,29,0.4)] hover:scale-[1.02] transition-transform uppercase tracking-widest flex items-center justify-center gap-3"
        >
          <span className="text-2xl">💰</span> Bet & Win Big!
        </a>
        
        <div className="w-full md:w-2/3 min-h-[100px] flex items-center justify-center bg-black/20 rounded-xl overflow-hidden border border-[var(--wc-border)]">
          <script async={true} data-cfasync="false" src="https://pl29770202.effectivecpmnetwork.com/3ffa407b9e421b28184453613f9fdd5c/invoke.js"></script>
          <div id="container-3ffa407b9e421b28184453613f9fdd5c"></div>
        </div>
      </div>

      <MatchGrid />
    </div>
  );
}
