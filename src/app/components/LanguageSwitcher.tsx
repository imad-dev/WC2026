import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { LANGUAGES } from '../../i18n';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2 rounded-lg transition-colors hover:bg-surface-2 text-xs font-semibold"
        style={{ color: 'var(--white-muted)' }}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLang.flag} {currentLang.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-36 rounded-xl border z-50 overflow-hidden shadow-2xl"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors hover:bg-surface-2 text-left"
                style={{ 
                  color: i18n.language === lang.code ? 'var(--white-primary)' : 'var(--white-ghost)',
                  background: i18n.language === lang.code ? 'var(--surface-3)' : 'transparent'
                }}
              >
                <span>{lang.flag} {lang.label}</span>
                {i18n.language === lang.code && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green-live)' }} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
