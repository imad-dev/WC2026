import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: `WC2026.games collects minimal information necessary to provide and improve our service. We may collect:

• **Usage data**: Pages visited, time spent, buttons clicked, and general navigation patterns — collected automatically via Vercel Analytics. This data is anonymous and aggregated.
• **Device & Browser information**: Browser type, operating system, screen resolution, and general geographic location (country/region level only) for analytics purposes.
• **Contact information**: If you submit our Contact form, we collect your name, email address, and the message content solely to respond to your inquiry.
• **Cookies**: We use session cookies necessary for the website to function and analytics cookies. We do not use advertising or tracking cookies.`,
    },
    {
      title: '2. How We Use Your Information',
      content: `The information we collect is used to:

• Provide and maintain the WC2026.games service
• Understand how visitors use our site so we can improve it
• Respond to your inquiries and support requests
• Monitor and analyze usage trends
• Ensure the technical security and proper functioning of our website

We do not sell, trade, rent, or share your personal information with third parties for marketing purposes.`,
    },
    {
      title: '3. Analytics (Vercel Analytics)',
      content: `We use Vercel Analytics to understand site traffic and usage. This service collects anonymized, aggregated data. It does not use cookies or fingerprinting. No personally identifiable information is associated with analytics data. You can learn more at vercel.com/analytics.`,
    },
    {
      title: '4. Cookies',
      content: `WC2026.games uses the following types of cookies:

• **Essential cookies**: Required for the website to function (e.g., session management, UI state). You cannot opt out of these without disabling our site.
• **Analytics cookies**: Used anonymously by Vercel Analytics to track aggregate page views. These do not identify you personally.

We do not use advertising, behavioral tracking, or third-party marketing cookies. You may disable cookies in your browser settings; however, this may impact certain features of our site.`,
    },
    {
      title: '5. Third-Party Links & Data',
      content: `Our website may reference or link to third-party websites (such as Wikipedia, official FIFA pages, or club websites). We are not responsible for the privacy practices of these third-party sites and encourage you to review their privacy policies separately.

Football data displayed on WC2026.games is sourced from publicly available datasets. We make every effort to ensure accuracy but cannot guarantee real-time correctness.`,
    },
    {
      title: '6. Data Security',
      content: `We take the security of your information seriously. Our site is served over HTTPS. Contact form submissions are transmitted securely. We implement industry-standard technical measures to protect against unauthorized access, alteration, or destruction of data.

However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`,
    },
    {
      title: '7. Your Rights (GDPR & CCPA)',
      content: `Depending on your location, you may have the right to:

• **Access** the personal data we hold about you
• **Correct** inaccurate or incomplete data
• **Delete** your personal data ("right to be forgotten")
• **Object** to or restrict the processing of your data
• **Data portability** — receive your data in a portable format

To exercise any of these rights, please contact us at legal@wc2026.games. We will respond within 30 days.`,
    },
    {
      title: '8. Children\'s Privacy',
      content: `WC2026.games is intended for a general audience and is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.`,
    },
    {
      title: '9. Changes to This Policy',
      content: `We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. When we do, we will revise the "Last Updated" date at the top of this page. We encourage you to review this policy regularly. Continued use of WC2026.games after changes constitutes acceptance of the updated policy.`,
    },
    {
      title: '10. Contact Us',
      content: `If you have any questions about this Privacy Policy, please contact us:\n\n• **Email**: legal@wc2026.games\n• **Website**: www.wc2026.games/contact`,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--void)', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="border-b px-6 md:px-20 py-4 flex items-center gap-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-glass)', backdropFilter: 'blur(20px)' }}>
        <Link to="/" className="flex items-center gap-2 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--green-live)' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span style={{ color: 'var(--border)' }}>|</span>
        <div style={{ fontFamily: 'var(--font-display)' }}>
          <span className="font-extrabold text-white">WC</span>
          <span className="font-extrabold" style={{ color: 'var(--green-live)' }}>2026</span>
          <span className="text-sm ml-1" style={{ color: 'var(--white-ghost)' }}>.games</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16">
        {/* Title */}
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-6 h-6" style={{ color: 'var(--green-live)' }} />
          <h1 className="text-4xl font-extrabold uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}>
            Privacy Policy
          </h1>
        </div>
        <p className="text-sm mb-2" style={{ color: 'var(--white-ghost)' }}>Last Updated: April 21, 2026</p>
        <p className="text-sm mb-12" style={{ color: 'var(--white-muted)' }}>
          This Privacy Policy describes how WC2026.games ("we", "us", or "our") collects, uses, and protects the information you provide when using our website located at <strong style={{ color: 'var(--white-primary)' }}>www.wc2026.games</strong>.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="rounded-xl border p-6" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <h2 className="text-base font-bold mb-3" style={{ color: 'var(--white-primary)', fontFamily: 'var(--font-display)' }}>
                {s.title}
              </h2>
              <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--white-muted)' }}>
                {s.content.split('\n').map((line, i) => {
                  // Bold text between **
                  const parts = line.split(/\*\*(.*?)\*\*/g);
                  return (
                    <p key={i} className={line.startsWith('•') ? 'ml-2 my-1' : 'my-1'}>
                      {parts.map((part, j) =>
                        j % 2 === 1
                          ? <strong key={j} style={{ color: 'var(--white-primary)' }}>{part}</strong>
                          : part
                      )}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <PageFooter />
    </div>
  );
}

function PageFooter() {
  return (
    <footer className="border-t mt-16 py-8 px-6 md:px-20 text-center text-xs" style={{ borderColor: 'var(--border)', color: 'var(--white-ghost)' }}>
      <div className="flex flex-wrap justify-center gap-6 mb-3">
        <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
      </div>
      <p>© 2026 WC2026.games · All rights reserved · Not affiliated with FIFA</p>
    </footer>
  );
}
