import { HeroCountdown } from './components/wc2026/HeroCountdown';
import { TournamentKPIs } from './components/TournamentKPIs';
import { HomeBelowFold } from './components/HomeBelowFold';

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[var(--wc-dark)]">
      {/* SEO text */}
      <div className="sr-only">
        <h1>FIFA World Cup 2026 Live Hub</h1>
        <p>The ultimate live streaming and statistics hub for the 2026 FIFA World Cup. Follow your favorite teams, view real-time match data, predict outcomes, and connect with fans globally. Host countries: USA, Canada, Mexico.</p>
      </div>
      
      <HeroCountdown />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 space-y-20">
        <TournamentKPIs />

        {/* Homepage Monetization Section */}
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          <a 
            href="https://www.effectivecpmnetwork.com/steh40ys?key=c3817b02a6ce5ba1e04b14695f562abc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-4 sm:py-5 bg-gradient-to-r from-[var(--wc-red)] to-red-600 text-white font-bold text-lg sm:text-xl rounded-xl text-center shadow-[0_0_20px_rgba(232,0,29,0.4)] hover:scale-[1.02] transition-transform uppercase tracking-widest flex items-center justify-center gap-3"
          >
            <span className="text-2xl sm:text-3xl">🏆</span> Predict the 2026 Champion & Win Big!
          </a>
          
          <div className="w-full min-h-[100px] flex items-center justify-center bg-black/20 rounded-xl overflow-hidden border border-[var(--wc-border)]">
            <script async={true} data-cfasync="false" src="https://pl29770202.effectivecpmnetwork.com/3ffa407b9e421b28184453613f9fdd5c/invoke.js"></script>
            <div id="container-3ffa407b9e421b28184453613f9fdd5c"></div>
          </div>
        </div>

        <HomeBelowFold />
      </div>
    </div>
  );
}
