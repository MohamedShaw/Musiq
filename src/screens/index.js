import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';

import { Provider } from 'react-redux';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import PlayerScreen from './palyerSound/PlayerSound';
import store from '../store';

import ProductList from './productList/ProductList';
import ProducDetails from './productDetails/ProducDetails';
import ShoppingCart from './shoppingCart/ShoppingCart';
import TrackList from './trackList/TrackList';
import SignUp from './signUp/SignUp';
import SignIn from './signIn/SignIn';
import Test from './trackList/test';

export const registerScreens = () => {
  Navigation.registerComponentWithRedux(
    'productList',
    () => gestureHandlerRootHOC(ProductList),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'productDetails',
    () => gestureHandlerRootHOC(ProducDetails),
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'shoppingCart',
    () => gestureHandlerRootHOC(ShoppingCart),
    Provider,
    store,
  );

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
  Navigation.registerComponentWithRedux(
    'test',
    () => gestureHandlerRootHOC(Test),
    Provider,
    store,
  );
};
