"use client";

import { useEffect } from 'react';

// Dynamically initialise i18n only on the client (avoids SSR document errors)
export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This import is safe: runs only in the browser
    import('@/i18n').catch(console.error);
  }, []);

  return <>{children}</>;
}
