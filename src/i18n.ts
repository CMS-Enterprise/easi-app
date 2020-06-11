import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from 'i18n/en-US';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  'en-US': enUS
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en-US'
  });

export default i18n;
