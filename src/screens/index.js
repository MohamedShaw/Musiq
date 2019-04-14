import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';

import { Provider } from 'react-redux';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import PlayerScreen from './palyerSound/PlayerSound';
import store from '../store';

import TrackList from './trackList/TrackList';
import SignUp from './signUp/SignUp';
import SignIn from './signIn/SignIn';

export const registerScreens = () => {
  Navigation.registerComponentWithRedux(
    'signUp',
    () => gestureHandlerRootHOC(SignUp),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'signIn',
    () => gestureHandlerRootHOC(SignIn),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'trackList',
    () => gestureHandlerRootHOC(TrackList),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'PlayerScreen',
    () => gestureHandlerRootHOC(PlayerScreen),
    Provider,
    store,
  );
};
