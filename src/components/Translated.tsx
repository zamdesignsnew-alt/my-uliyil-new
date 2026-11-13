'use client';
import { useEffect, useState } from 'react';

export function useLanguage() {
  const [lang, setLang] = useState<'en' | 'ml'>('en');

  useEffect(() => {
    const sync = () => {
      const next = localStorage.getItem('uliyil-lang') === 'ml' ? 'ml' : 'en';
      setLang(next);
      document.documentElement.lang = next;
    };
    sync();
    window.addEventListener('uliyil-language', sync);
    return () => window.removeEventListener('uliyil-language', sync);
  }, []);

  return lang;
}

export function T({ en, ml }: { en: string; ml: string }) {
  const lang = useLanguage();
  return <>{lang === 'ml' ? ml : en}</>;
}
