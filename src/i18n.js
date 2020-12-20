// External localisation dependencies
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Localisation files
import translationEnUs from './locales/translation.en-US.json';
import translationRoRo from './locales/translation.ro-RO.json';

// Set up the localisation
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEnUs,
    },
    ro: {
      translation: translationRoRo,
    },
  },
  fallbackLng: 'en',
  lng: 'en',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
