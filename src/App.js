import I18n from 'react-native-i18n';
import axios from 'axios';
import { registerScreens } from './screens';
import store from './store';

import {
  checkLocationPermission,
  initBackgroundGeolocation,
} from './actions/location';
import { AppNavigation } from './common';
import { initLang, setLang } from './actions/lang';
import { autoLogin } from './actions/AuthActions';

const { Navigation } = require('react-native-navigation');
const { Platform, AsyncStorage } = require('react-native');

export const start = async () => {
  registerScreens();

  axios.interceptors.request.use(
    config => {
      const { currentUser } = store.getState().auth;
      const { lang } = store.getState().lang;

      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: currentUser
            ? `Bearer ${currentUser.access_token}`
            : config.headers.Authorization,
        },
      };
    },
    error => {
      Promise.reject(error);
    },
  );
  Navigation.events().registerAppLaunchedListener(async () => {
    Navigation.setDefaultOptions({
      statusBar: {
        visible: true,
        backgroundColor: '#8D3132',
      },
      topBar: {
        drawBehind: true,
        visible: false,
        animate: false,
      },
    });

    checkLocationPermission(true, () => {
      initBackgroundGeolocation(store.dispatch, store.getState);
    });
    await initLang('en', true)(store.dispatch);

    // AsyncStorage.setItem('@CurrentUser', '');

    const { exist } = await autoLogin()(store.dispatch, store.getState);

    if (exist) {
      AppNavigation.init('MAIN_STACK', {
        name: 'trackList',
      });
    } else {
      AppNavigation.init('MAIN_STACK', {
        name: 'signIn',
      });
    }
  });
};
