import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationJP from '../locales/jp/translation.json';
import translationEN from '../locales/en/translation.json';
import translationVI from '../locales/vi/translation.json';
import translationKR from '../locales/kr/translation.json';
import Config from 'config';

// the translations
const resources = {
  jp: {
    translation: translationJP
  },
  en: {
    translation: translationEN
  },
  vi: {
    translation: translationVI
  },
  kr: {
    translation: translationKR
  }
};

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    lng: 'jp',
    fallbackLng: 'jp',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });


export default i18n;