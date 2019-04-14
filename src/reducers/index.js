import { combineReducers } from 'redux';

import lang from './lang';

import location from './location';
import network from './network';
import auth from './auth';

export default combineReducers({
  lang,

  location,
  network,
  auth,
});
