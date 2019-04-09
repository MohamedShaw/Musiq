import { PermissionsAndroid, Alert, AppState, Platform } from 'react-native';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import OpenSettings from 'react-native-open-settings';

import { SET_LOCATION, RESET_LOCATION, SET_GPS_STATUS } from './types';

let registered = false;
let settingDialogVisible = false;

const showGoToSettingsDialog = () => {
  settingDialogVisible = true;

  Alert.alert(
    "صلاحيات تحديد المكان",
    "لأفضل استخدام للتطبيق, يجب تفعيل صلاحيات تحديد المكان من إعدادات التطبيق",
    [
      {
        text: "الإعدادات",
        onPress: () => {
          settingDialogVisible = false;
          OpenSettings.openSettings();
        },
      },
    ],
    { cancelable: false },
  );
};

export const checkLocationPermission = async (loop, callback = () => {}) => {
  if (Platform.OS === 'ios') {
    callback();
    return;
  }

  const handleAppStateChange = async evt => {
    if (
      Platform.OS === 'android' &&
      evt === 'active' &&
      !settingDialogVisible
    ) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        showGoToSettingsDialog();
      } else if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setTimeout(() => {
          AppState.removeEventListener('change', handleAppStateChange);
        }, 150);
        callback();
      }
    }
  };

  let granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (!loop) callback();
  else {
    while (granted === PermissionsAndroid.RESULTS.DENIED) {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

    if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      showGoToSettingsDialog();
      setTimeout(() => {
        AppState.addEventListener('change', handleAppStateChange);
      }, 150);
    } else if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      setTimeout(() => {
        AppState.removeEventListener('change', handleAppStateChange);
      }, 150);
      callback();
    }
  }
};

export const initBackgroundGeolocation = (dispatch, getState) => {
  if (!registered) {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.MEDIUM_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'Food Services Provider',
      notificationText: '',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 2000,
      fastestInterval: 1000,
      activitiesInterval: 1000,
      stopOnStillActivity: false,
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');

      BackgroundGeolocation.checkStatus(
        async ({ isRunning, locationServicesEnabled, authorization }) => {
          const isOn =
            Platform.OS === 'ios'
              ? true
              : locationServicesEnabled && authorization && isRunning;

          dispatch({
            type: SET_GPS_STATUS,
            payload: isOn,
          });
        },
      );
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('location', location => {
      dispatch({
        type: SET_LOCATION,
        payload: { ...location },
      });
    });

    BackgroundGeolocation.on('background', () => {
      BackgroundGeolocation.stop();
    });

    BackgroundGeolocation.on('foreground', () => {
      BackgroundGeolocation.start();
    });

    BackgroundGeolocation.on('authorization', status => {
      BackgroundGeolocation.checkStatus(
        ({ isRunning, locationServicesEnabled, authorization }) => {
          const isOn = locationServicesEnabled && authorization && isRunning;
          dispatch({
            type: SET_GPS_STATUS,
            payload: isOn,
          });
        },
      );
    });
  }

  BackgroundGeolocation.checkStatus(
    ({ isRunning, locationServicesEnabled, authorization }) => {
      if (Platform.OS === 'ios') {
        dispatch({
          type: SET_GPS_STATUS,
          payload: true,
        });
      } else {
        dispatch({
          type: SET_GPS_STATUS,
          payload: locationServicesEnabled && authorization,
        });
      }
    },
  );

  BackgroundGeolocation.start();
  registered = true;
};
