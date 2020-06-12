import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from 'i18n/en-US';

const resources = {
  'en-US': enUS
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en-US'
});

export default i18n;
