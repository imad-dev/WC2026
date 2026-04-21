import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Send, CheckCircle, ArrowLeft } from 'lucide-react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('sending');
    // Simulate async submission (replace with Formspree/EmailJS/etc in production)
    await new Promise(r => setTimeout(r, 1500));
    setStatus('success');
  };

  const field = (id: keyof typeof form, label: string, type = 'text', rows?: number) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>
        {label} <span style={{ color: 'var(--red-loss)' }}>*</span>
      </label>
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          value={form[id]}
          onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
          placeholder={`Enter your ${label.toLowerCase()}...`}
          className="rounded-lg px-4 py-3 text-sm outline-none transition-all resize-none"
          style={{
            background: 'var(--surface-2)',
            border: `1px solid ${errors[id] ? 'var(--red-loss)' : 'var(--border)'}`,
            color: 'var(--white-primary)',
          }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={form[id]}
          onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
          placeholder={`Enter your ${label.toLowerCase()}...`}
          className="rounded-lg px-4 py-3 text-sm outline-none transition-all"
          style={{
            background: 'var(--surface-2)',
            border: `1px solid ${errors[id] ? 'var(--red-loss)' : 'var(--border)'}`,
            color: 'var(--white-primary)',
          }}
        />
      )}
      {errors[id] && <span className="text-xs" style={{ color: 'var(--red-loss)' }}>{errors[id]}</span>}
    </div>
  );

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

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6"
            style={{ borderColor: 'rgba(0,230,118,0.3)', background: 'rgba(0,230,118,0.08)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green-live)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--green-live)' }}>Contact Us</span>
          </div>
          <h1 className="text-5xl font-extrabold uppercase mb-4"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: 'var(--white-primary)' }}>
            Get in <span style={{ color: 'var(--green-live)' }}>Touch</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--white-muted)' }}>
            Have a question, spotted an error, or want to suggest a feature? We'd love to hear from you. We aim to respond within 48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Info cards */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: 'Email Us', sub: 'General enquiries', value: 'contact@wc2026.games', color: 'var(--green-live)' },
              { icon: Mail, title: 'Legal', sub: 'Privacy & legal matters', value: 'legal@wc2026.games', color: 'var(--gold-leader)' },
              { icon: MessageSquare, title: 'Data Corrections', sub: 'Wrong score, coach, or squad?', value: 'data@wc2026.games', color: '#448AFF' },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border p-5" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <c.icon className="w-4 h-4 flex-shrink-0" style={{ color: c.color }} />
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--white-primary)' }}>{c.title}</div>
                    <div className="text-xs" style={{ color: 'var(--white-ghost)' }}>{c.sub}</div>
                  </div>
                </div>
                <div className="text-xs font-mono mt-1 ml-7" style={{ color: c.color }}>{c.value}</div>
              </div>
            ))}

            {/* Response time card */}
            <div className="rounded-xl border p-5" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--white-ghost)' }}>Response Time</div>
              <div className="space-y-2 text-xs" style={{ color: 'var(--white-muted)' }}>
                <div className="flex justify-between"><span>General</span><span style={{ color: 'var(--green-live)' }}>24–48 hrs</span></div>
                <div className="flex justify-between"><span>Data corrections</span><span style={{ color: 'var(--gold-leader)' }}>6–12 hrs</span></div>
                <div className="flex justify-between"><span>Legal</span><span style={{ color: 'var(--white-ghost)' }}>3–5 business days</span></div>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border p-8" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              {status === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--green-live)' }} />
                  <h2 className="text-2xl font-extrabold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--white-primary)' }}>
                    Message Sent!
                  </h2>
                  <p className="text-sm mb-6" style={{ color: 'var(--white-muted)' }}>
                    Thanks for reaching out. We'll get back to you within 48 hours.
                  </p>
                  <button onClick={() => { setForm({ name:'', email:'', subject:'', message:'' }); setStatus('idle'); }}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: 'var(--green-live)', color: 'var(--void)' }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field('name', 'Full Name')}
                    {field('email', 'Email Address', 'email')}
                  </div>
                  {field('subject', 'Subject')}
                  {/* Subject pills */}
                  <div className="flex flex-wrap gap-2">
                    {['Data Correction', 'Feature Request', 'Bug Report', 'Partnership', 'General'].map(s => (
                      <button key={s} type="button"
                        onClick={() => setForm(f => ({ ...f, subject: s }))}
                        className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                        style={{
                          background: form.subject === s ? 'var(--green-live)' : 'var(--surface-2)',
                          color: form.subject === s ? 'var(--void)' : 'var(--white-muted)',
                          border: form.subject === s ? 'none' : '1px solid var(--border)',
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                  {field('message', 'Message', 'text', 5)}

                  {status === 'error' && (
                    <p className="text-sm" style={{ color: 'var(--red-loss)' }}>
                      Something went wrong. Please try emailing us directly at contact@wc2026.games
                    </p>
                  )}

                  <button type="submit" disabled={status === 'sending'}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'var(--green-live)', color: 'var(--void)' }}>
                    {status === 'sending' ? (
                      <><span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full inline-block" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                  <p className="text-xs text-center" style={{ color: 'var(--white-ghost)' }}>
                    By submitting, you agree to our{' '}
                    <Link to="/privacy" className="underline hover:text-white">Privacy Policy</Link>
                  </p>
                </form>
              )}
            </div>
          </div>
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
