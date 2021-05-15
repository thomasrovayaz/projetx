import {I18nManager} from 'react-native';
import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import memoize from 'lodash.memoize';

const translationGetters: any = {
  // lazy requires (metro bundler does not support symlinks)
  fr: () => require('./android/app/src/main/assets/translations/fr.json'),
};

export const translate = memoize(key => i18n.t(key, {defaultValue: key}));

export const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = {languageTag: 'fr', isRTL: false};

  const {languageTag, isRTL} =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  // @ts-ignore
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);

  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
};
