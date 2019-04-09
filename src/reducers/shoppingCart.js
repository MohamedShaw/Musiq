import { AsyncStorage } from 'react-native';
import * as types from '../actions/types';

const initialState = {
  cart: [],
  totalCounter: 0,
  totalPrice: 0,
};

const shoppingCart = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_PRODUCT_CART:
      let newCart = state.cart.slice();
      let totalPrice = state.totalPrice;
      let totalCounter = state.totalCounter;
      // findIndex return 1 or -1
      const selected = newCart.findIndex(item => item.id === action.payload.id);
      if (selected >= 0) {
        if (action.payload.counter + newCart[selected].counter < 0)
          return state;

        const addNewObj = action.payload;
        newCart[selected].counter += action.payload.counter;

        newCart[selected].priceOfProdut =
          newCart[selected].price * newCart[selected].counter;
        // totalPrice += +action.payload.price
      } else {
        const addNewObj = action.payload;
        addNewObj.counter = action.payload.counter;
        addNewObj.priceOfProdut = addNewObj.price * addNewObj.counter;

        newCart = [...newCart, addNewObj];
      }

      totalCounter += +action.payload.counter;

      totalPrice += +action.payload.price * +action.payload.counter;

      AsyncStorage.setItem('@CART', JSON.stringify(newCart));
      AsyncStorage.setItem('@TOTAL', JSON.stringify(totalPrice));
      AsyncStorage.setItem('@COUNTER', JSON.stringify(totalCounter));
      return {
        ...state,
        cart: newCart,
        totalCounter,
        totalPrice,
      };

    case types.FILTER_CART:
      const cartFilter = state.cart.filter(item => item.counter > 0);
      console.log('FILTER CARD =====>>>>', cartFilter);
      AsyncStorage.setItem('@CART', JSON.stringify(cartFilter));


      return {
        ...state,
        cart: cartFilter,
      };

    case types.REMOVE_CART:
      const itemId = action.payload.id;

      const counterRemoved = action.payload.counter;
      const priceRemoved = action.payload.priceOfProdut;


      const cartAfterRemoved = state.cart.filter(item => item.id !== itemId);

      // console.log("remove ====", cartRemoved);

      AsyncStorage.setItem('@CART', JSON.stringify(cartAfterRemoved));
      AsyncStorage.setItem('@TOTAL', JSON.stringify(+(state.totalPrice - priceRemoved)));
      AsyncStorage.setItem('@COUNTER', JSON.stringify(+(state.totalCounter - counterRemoved)));

      return {
        ...state,
        cart: [...cartAfterRemoved],
        totalCounter: state.totalCounter - counterRemoved,
        totalPrice: state.totalPrice - priceRemoved,
      };

    default:
      return state;
  }
};

export default shoppingCart;
