import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import App from "./app/App.tsx";
import AboutUs from "./app/pages/AboutUs.tsx";
import PrivacyPolicy from "./app/pages/PrivacyPolicy.tsx";
import TermsOfService from "./app/pages/TermsOfService.tsx";
import ContactUs from "./app/pages/ContactUs.tsx";
import NewsPage from "./app/pages/NewsPage.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/news" element={<NewsPage />} />
    </Routes>
    <Analytics />
  </BrowserRouter>
);