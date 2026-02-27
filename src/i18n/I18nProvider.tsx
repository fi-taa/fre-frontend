'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@/i18n/config';
import am from '@/i18n/messages/am.json';
import en from '@/i18n/messages/en.json';
import om from '@/i18n/messages/om.json';

interface I18nContextValue {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const MESSAGES: Record<Locale, Record<string, string>> = {
  am,
  om,
  en,
};

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem('fre.locale');
    if (stored && (SUPPORTED_LOCALES as string[]).includes(stored)) {
      setLocaleState(stored as Locale);
      return;
    }

    const browserLang = window.navigator.language?.slice(0, 2) as Locale | undefined;
    if (browserLang && SUPPORTED_LOCALES.includes(browserLang)) {
      setLocaleState(browserLang);
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('fre.locale', next);
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      const dict = MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
      return dict[key] ?? key;
    },
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t,
      setLocale,
    }),
    [locale, t, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}

