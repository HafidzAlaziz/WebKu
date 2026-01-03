import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';

import idTranslation from './locales/id.json';
import jaTranslation from './locales/ja.json';
import esTranslation from './locales/es.json';
import frTranslation from './locales/fr.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation
            },
            id: {
                translation: idTranslation
            },
            ja: {
                translation: jaTranslation
            },
            es: {
                translation: esTranslation
            },
            fr: {
                translation: frTranslation
            }
        },
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        },
        detection: {
            order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage']
        }
    });

export default i18n;
