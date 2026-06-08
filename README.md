# 🏆 WC2026.games — FIFA World Cup 2026 Live Hub

WC2026.games is a high-performance, real-time web application designed to be the ultimate companion for the 2026 FIFA World Cup. It provides live match streaming, real-time score updates, group standings, automated news aggregation, and an interactive match prediction system.

---

## ✨ Key Features & UI / UX

The user interface was built with a highly responsive, modern, "Glassmorphism" aesthetic targeting mobile-first fan engagement.

- **Dynamic Hero Countdown:** A stunning hero banner that calculates real-time days, hours, and minutes until the opening kickoff on June 11, 2026.
- **Match Predictor Engine:** A zero-latency, Optimistic UI widget embedded into every match card. Users can vote for "Team A", "Draw", or "Team B" and instantly see animated percentage bars reflecting crowd-sourced data.
- **Live Match Player:** A seamlessly integrated video player that utilizes geo-routing edge functions to fetch the correct streaming links for the user's country.
- **Real-Time Schedule & Standings:** Match cards and group standings that update instantaneously when the database changes, without requiring a page refresh.
- **Custom Brand Aesthetics:** Uses a tailored, highly-polished dark mode CSS theme featuring official World Cup inspired colors (`--blue-ref`, `--green-live`, `--gold-leader`).

---

## 🛠️ Technology Stack

Built on the bleeding edge of the modern web stack for maximum performance and SEO velocity.

### Frontend
- **Framework:** Next.js 16 (App Router) with Turbopack for lightning-fast compilation.
- **Language:** TypeScript for end-to-end type safety.
- **Styling:** Tailwind CSS integrated with deep custom CSS variables for design tokens.
- **Icons:** `lucide-react` for clean, scalable vector iconography.

### Backend & Database (Supabase)
- **Database:** PostgreSQL via Supabase.
- **Realtime:** Uses `@supabase/supabase-js` realtime channels (PostgreSQL changes) to push live score updates directly to connected clients.
- **Compute:** Secure RPC (Remote Procedure Call) functions executed directly on the database (e.g., `get_prediction_percentages`) to aggregate millions of votes securely.
- **Security:** Strict Row Level Security (RLS) policies allowing public reads for matches, while securely gating write access to predictions via anonymous local-storage session IDs.

### Hosting & Automation
- **Deployment:** Vercel (Serverless Edge Network).
- **Automation:** Vercel Cron Jobs (`vercel.json`) mapped to Next.js API routes (`/api/cron/...`) that run daily/hourly to sync match data, standings, and external video streams.
- **APIs:** Integrates with API-Football (v3) for match data, and YouTube Data API (v3) for fallback highlight scraping.

---

## 🔍 Technical SEO & Optimization

The platform is aggressively optimized for search engine indexing, ensuring high visibility during peak traffic windows.

- **Rich Structured Data:** Next.js App Router injects standard JSON-LD schemas (`WebSite`, `SportsEvent`, `Organization`) directly into the global `layout.tsx` to ensure rich snippets in Google Search.
- **Metadata APIs:** Utilizes the native Next.js Metadata API to generate dynamic OpenGraph (`og:image`) and Twitter Cards.
- **Dynamic Sitemap & Robots:** Fully compliant `sitemap.xml` and `robots.txt` ensuring AI crawlers (GPTBot, ClaudeBot, Perplexity) and Googlebot can traverse all match pages instantly.
- **Edge Routing:** Implements Vercel Edge functions (`/api/geo.ts`) to resolve the user's location under 50ms to deliver geographically compliant streams.

---

## 🗄️ Database Architecture

The data layer is managed in Supabase and comprises several highly optimized tables:

1. **`wc2026_matches`**: The core source of truth. Tracks `kickoff_utc`, `status` (upcoming, live, finished), `home_score`, `away_score`, and the `youtube_video_id`.
2. **`wc2026_predictions`**: An append-only structure for the Match Predictor. Tracks `match_id`, `user_id` (anonymous UUID), and `choice`.
3. **`wc_standings` & `wc_scorers`**: Tables synced automatically via cron jobs to maintain the latest tournament statistics.
4. **`wc2026_config`**: Key-value pair configuration for remote-controlling the website (e.g., overriding a live broadcast ID instantly).

---

## 🚀 Getting Started

To run the project locally:

```bash
# 1. Install dependencies
pnpm install

# 2. Setup your .env.local file
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 3. Run the development server with Turbopack
pnpm run dev
```