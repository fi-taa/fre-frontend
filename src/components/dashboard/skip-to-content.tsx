'use client';

import { useI18n } from '@/i18n/I18nProvider';

export function SkipToContent() {
  const { t } = useI18n();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-text-light focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40"
    >
      {t('a11y.skipToContent')}
    </a>
  );
}
