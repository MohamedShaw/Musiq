import { Platform } from 'react-native';
import { SET_LOCATION, RESET_LOCATION, SET_GPS_STATUS } from '../actions/types';

const initialState = {
  current: {},
  ready: false,
  gpsRunning: Platform.OS === 'ios',
};

const LocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION:

    
      return { ...state, current: action.payload, ready: true };

    case RESET_LOCATION:
      return { ...state, ready: false };

    case SET_GPS_STATUS:
      return { ...state, gpsRunning: action.payload };

    default:
      return state;
  }
};

export default LocationReducer;
