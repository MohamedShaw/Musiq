import * as types from './types';

export const addProductToCart = (data, counter) => dispatch => {
  // console.log("DATA IN ATIONSSSS ,", data) ;

  console.log('counter', counter);

  dispatch({ type: types.ADD_PRODUCT_CART, payload: { ...data, counter } });
};

export const filterCart = data => dispatch => {
  dispatch({ type: types.FILTER_CART, payload: data });
};

export const removeItem = data => dispatch => {
  dispatch({ type: types.REMOVE_CART, payload: data });
};
