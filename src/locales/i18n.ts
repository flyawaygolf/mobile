import i18n, { Module, Newable, NewableModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import english from './en.json';
import french from './fr.json';

import * as RNLocalize from 'react-native-localize';

export const resources = {
    en: {
        translation: english,
    },
    fr: {
        translation: french,
    },
};

export const EN = { locale: 'en-US', language: 'English', code: 'en' };
export const FR = { locale: 'fr-FR', language: 'Français', code: 'fr' };

export const languages = {
    'en-US': EN,
    'fr-FR': FR,
};

export const languageList = Object.values(languages);

const languageDetector: Module | NewableModule<Module> | Newable<Module> | any = {
    type: 'languageDetector',
    async: true,
    detect: (callback: any) => {
        return callback(RNLocalize.getLocales()[0].languageCode);
    },
    init: () => {},
    cacheUserLanguage: () => {},
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        resources,
        compatibilityJSON: 'v4',
        fallbackLng: 'en',
    });
