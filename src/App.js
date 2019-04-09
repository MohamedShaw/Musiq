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
        backgroundColor: '#A80080',
      },
      topBar: {
        drawBehind: true,
        visible: false,
        animate: false,
      },
    });

    // checkLocationPermission(true, () => {
    //   initBackgroundGeolocation(store.dispatch, store.getState);
    // });
    await initLang('en', true)(store.dispatch);

    let cart = '';
    let total = 0;
    let counter = 0;

    try {
      cart = await AsyncStorage.getItem('@CART');
      total = await AsyncStorage.getItem('@TOTAL');
      counter = await AsyncStorage.getItem('@COUNTER');
    } catch (error) {
      console.log('AsyncStorage#getItem error: ', error.message);
    }

    if (cart !== null || total !== null) {
      cart = JSON.parse(cart);
      total = JSON.parse(total);

      counter = JSON.parse(counter);
      store.getState().shoppingCart.cart = cart;
      store.getState().shoppingCart.totalPrice = +total;
      store.getState().shoppingCart.totalCounter = +counter;
    }
    // AsyncStorage.setItem('@CurrentUser', '');

    const { exist } = await autoLogin()(store.dispatch, store.getState);

    if (exist) {
      console.log('EXIST HERE ');

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
