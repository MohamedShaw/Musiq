import { I18nManager } from 'react-native';
import I18n from 'react-native-i18n';

import { LocaleEn, LocaleAr } from './src/common';
import ar from './src/translations/ar.json';
import en from './src/translations/en.json';

import { start } from './src/App';

I18nManager.allowRTL(false);

I18n.translations = {
  ar: Object.assign(LocaleAr, ar),
  en: Object.assign(LocaleEn, en),
};
start();
