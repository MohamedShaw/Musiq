import axios from 'axios';
import { AsyncStorage } from 'react-native';
import I18n from 'react-native-i18n';
import firebase from 'react-native-firebase';
import { LOGIN_SUCCESS, LOGIN_FAIL, LOGIN_RESET_ERROR, LOGOUT } from './types';
import { API_ENDPOINT_GATEWAY } from '../utils/config';
import { showError } from '../common/utils/localNotifications';
import { AppNavigation } from '../common';
// import { setHomeScreen, setHomeScreenDelivery } from '../utils';
import store from '../store';

export const setCurrentUser = data => async (dispatch, getState) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: data,
  });
};

export const resetLoginError = () => async (dispatch, getState) => {
  dispatch({
    type: LOGIN_RESET_ERROR,
  });
};
export const signIn = (values, setSubmitting) => async (dispatch, getState) => {
  try {
    const response = await axios.post(`${API_ENDPOINT_GATEWAY}auth/login`, {
      client_id: 2,
      client_secret: 'w2CRhJBYLAWXbzitqQ568YXCkwg8pMFIq9ya4U86',
      email: values.email,
      password: values.password,
    });

    setSubmitting(false);
    if (!response.data.status) {
      console.log('If statment');
      AppNavigation.setStackRoot({ name: 'trackList' });
      AsyncStorage.setItem('@CurrentUser', JSON.stringify(response.data));

      dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: LOGIN_FAIL, payload: I18n.t('invalid-user') });
    }
  } catch (error) {
    setSubmitting(false);

    dispatch({ type: LOGIN_FAIL, payload: I18n.t('invalid-user') });
    // showError(error[1].message);
  }
};

export function signUp(values, setSubmitting) {
  return async (dispatch, getState) => {
    const data = new FormData();
    console.log('values ==>>', values);

    data.append('client_id', '2');
    data.append('client_secret', 'w2CRhJBYLAWXbzitqQ568YXCkwg8pMFIq9ya4U86');

    data.append('username', values.username);
    data.append('email', values.email);
    data.append('password', values.password);
    data.append('first_name', values.first_name);
    data.append('last_name', values.last_name);

    console.log('data---->', data);

    try {
      const response = await axios.post(
        `${API_ENDPOINT_GATEWAY}auth/register`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (!response.data.status) {
        console.log('If statment');
        AppNavigation.setStackRoot({ name: 'trackList' });
        AsyncStorage.setItem('@CurrentUser', JSON.stringify(response.data));

        dispatch({ type: LOGIN_SUCCESS, payload: response.data });
      } else {
        showError(I18n.t('try-it-again'));
      }

      console.log('response===>>', response);
      setSubmitting(false);
    } catch (error) {
      console.log('error ----->>', JSON.parse(JSON.stringify(error)));

      setSubmitting(false);
    }
  };
}

export function onSignUpSocial(values, setSubmitting, accessToken) {
  return async (dispatch, getState) => {
    const v = {};

    if (values.nameAr) v.nameAr = values.nameAr;
    if (values.nameEn) v.nameEn = values.nameEn;
    if (values.email) v.email = values.email;
    if (values.city) v.city = values.city;
    if (values.country) v.country = values.country;
    if (values.phone) v.phone = values.phone;
    if (values.password) v.password = values.password;
    if (values.location) {
      v.location = [
        `${values.location.longitude}`,
        `${values.location.latitude}`,
      ];
    }

    try {
      const response = await axios.put(
        `${API_ENDPOINT_GATEWAY}auth/fields-needed`,
        v,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      dispatch({ type: LOGIN_SUCCESS, payload: response.data });
      if (!response.data.user.verified) {
        AppNavigation.setStackRoot({ name: 'otpScreen' });
      } else {
        clientCheck(response.data, setSubmitting)(dispatch, getState);
      }
    } catch (error) {
      showError(error[1].message);
      setSubmitting(false);
    }
  };
}
export const autoLogin = () => async (dispatch, getState) => {
  let userData = '';
  try {
    userData = await AsyncStorage.getItem('@CurrentUser');
  } catch (error) {
    console.log('AsyncStorage#getItem error: ', error.message);
  }

  if (userData) {
    userData = JSON.parse(userData);

    console.log('auto login');
    console.log(userData);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: userData,
    });
    AppNavigation.setStackRoot({
      name: 'trackList',
    });
    return { exist: true };
  }
  return { exist: false };
};

export const logout = () => async (dispatch, getState) => {
  await AsyncStorage.setItem('@CurrentUser', '');
  AppNavigation.setStackRoot({
    name: 'signIn',
  });
  setTimeout(() => dispatch({ type: LOGOUT }), 1500);
};
