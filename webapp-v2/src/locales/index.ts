import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import randomFacesJson from 'assets/data/random_faces.json';
import transitionFacesJson from 'assets/data/transition_faces.json';

const resources = {
  en: {
    randomFaces: randomFacesJson,
    transitionFaces: transitionFacesJson
  }
};

const namespaces = Object.keys(resources.en);

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources,
  ns: namespaces,
  interpolation: {
    escapeValue: false
  },
  debug: import.meta.env.DEV
});

export default i18n;
