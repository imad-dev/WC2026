import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using WC2026.games ("the Website"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our website.

These Terms apply to all visitors, users, and others who access or use the Website. We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Website following any changes constitutes your acceptance of the new Terms.`,
    },
    {
      title: '2. Description of Service',
      content: `WC2026.games is a sports information and entertainment website providing coverage of the 2026 FIFA World Cup, including but not limited to:

• Tournament schedules, group draws, and fixture lists
• Team profiles including coaches and key players
• Venue information and stadium details
• FIFA world rankings and statistical information
• General football news and updates related to WC2026

This service is provided free of charge and is intended for informational and entertainment purposes only.`,
    },
    {
      title: '3. Disclaimer of Affiliation',
      content: `WC2026.games is an independent, fan-created website. We are NOT affiliated with, endorsed by, sponsored by, or officially connected to:

• FIFA (Fédération Internationale de Football Association)
• The United States Soccer Federation (USSF)
• Canada Soccer
• Federación Mexicana de Fútbol (FMF)
• Any national football federation featured on this website
• Any football club, player, or agent

All team names, country names, and football-related terminology are used for informational purposes only.`,
    },
    {
      title: '4. Accuracy of Information',
      content: `While we make every effort to ensure the accuracy and timeliness of the information on WC2026.games, we cannot guarantee that all content is always complete, accurate, or up-to-date. Football is a rapidly evolving sport and information such as squad lists, coaches, and rankings can change frequently.

WC2026.games shall not be held liable for any errors, omissions, or inaccuracies in the information provided. Users are encouraged to verify critical information through official sources such as FIFA.com.`,
    },
    {
      title: '5. Intellectual Property',
      content: `The design, layout, code, and original content of WC2026.games (excluding third-party data) are the intellectual property of WC2026.games and are protected by applicable copyright laws.

You may not reproduce, duplicate, copy, sell, resell, or exploit any portion of our Website without express written permission. Personal, non-commercial use is permitted provided proper attribution is given.

Country flags and names used on this site are in the public domain or used under fair use principles for informational purposes.`,
    },
    {
      title: '6. User Conduct',
      content: `By using WC2026.games, you agree not to:

• Use the website for any unlawful purpose or in violation of any regulations
• Attempt to gain unauthorized access to any part of the website or its servers
• Use automated scripts, bots, or scrapers to extract data in bulk without permission
• Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the site
• Transmit any harmful, offensive, or disruptive content
• Impersonate any person or entity or misrepresent your affiliation with any person or entity`,
    },
    {
      title: '7. Limitation of Liability',
      content: `To the fullest extent permitted by law, WC2026.games, its owners, contributors, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill — arising from:

• Your use of, or inability to use, the Website
• Any errors or inaccuracies in the content
• Unauthorized access to or alteration of your data
• Any other matter relating to the Website

The Website is provided on an "as is" and "as available" basis without any warranties of any kind.`,
    },
    {
      title: '8. External Links',
      content: `Our Website may contain links to third-party websites. These links are provided for your convenience and informational purposes only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them. Linking to a third-party website does not imply our endorsement of that site.`,
    },
    {
      title: '9. Governing Law',
      content: `These Terms of Service and any disputes arising out of or related to them shall be governed by and construed in accordance with applicable international laws. Any legal action or proceeding arising under these Terms shall be resolved through binding arbitration or, if not applicable, in the competent courts.`,
    },
    {
      title: '10. Contact',
      content: `For any questions regarding these Terms of Service, please contact us:\n\n• **Email**: legal@wc2026.games\n• **Website**: www.wc2026.games/contact`,
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
          <FileText className="w-6 h-6" style={{ color: 'var(--gold-leader)' }} />
          <h1 className="text-4xl font-extrabold uppercase" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}>
            Terms of Service
          </h1>
        </div>
        <p className="text-sm mb-2" style={{ color: 'var(--white-ghost)' }}>Last Updated: April 21, 2026</p>
        <p className="text-sm mb-12" style={{ color: 'var(--white-muted)' }}>
          Please read these Terms of Service carefully before using <strong style={{ color: 'var(--white-primary)' }}>www.wc2026.games</strong> operated by WC2026.games.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="rounded-xl border p-6" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <h2 className="text-base font-bold mb-3" style={{ color: 'var(--white-primary)', fontFamily: 'var(--font-display)' }}>
                {s.title}
              </h2>
              <div className="text-sm leading-relaxed" style={{ color: 'var(--white-muted)' }}>
                {s.content.split('\n').map((line, i) => {
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
