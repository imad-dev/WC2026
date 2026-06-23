'use client';

import { useGeo } from '@/hooks/useSupabase';

export function ScheduleAds() {
  const country = useGeo();

  if (country === 'ES') return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-center mb-6">
      <a 
        href="https://www.effectivecpmnetwork.com/steh40ys?key=c3817b02a6ce5ba1e04b14695f562abc" 
        target="_blank" 
        rel="noopener noreferrer nofollow"
        className="w-full md:w-1/3 py-4 bg-gradient-to-r from-[var(--wc-red)] to-red-600 text-white font-bold text-lg rounded-xl text-center shadow-[0_0_20px_rgba(232,0,29,0.4)] hover:scale-[1.02] transition-transform uppercase tracking-widest flex items-center justify-center gap-3"
      >
        <span className="text-2xl">💰</span> Bet & Win Big!
      </a>
      
      <div className="w-full md:w-2/3 min-h-[100px] flex items-center justify-center bg-black/20 rounded-xl overflow-hidden border border-[var(--wc-border)]">
        <script async={true} data-cfasync="false" src="https://pl29770202.effectivecpmnetwork.com/3ffa407b9e421b28184453613f9fdd5c/invoke.js"></script>
        <div id="container-3ffa407b9e421b28184453613f9fdd5c"></div>
      </div>
    </div>
  );
}
