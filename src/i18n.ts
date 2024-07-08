import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enUS from 'i18n/en-US';

const resources = {
  'en-US': enUS
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en-US',
    fallbackLng: 'en-US',
    resources,
    interpolation: {
      escapeValue: false // react already safe from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });

export default i18n;
