'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type Lang = 'en' | 'ar';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  isArabic: boolean;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  isArabic: false,
  dir: 'ltr',
});

export function DubaiLanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
  }, []);

  const isArabic = lang === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, setLang, isArabic, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useDubaiLang() {
  return useContext(LanguageContext);
}
