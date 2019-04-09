import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  FlatList,
  AsyncStorage,
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import Axois from 'axios';
import { AppView, AppScrollView, AppText } from '../../common';
import { AppHeader, CartItem, RowItems } from '../../component';

import { addProductToCart } from '../../actions/shoppingCart';

class ShoppingCart extends Component {
  render() {
    const { cart } = this.props;

    return (
      <AppView stretch flex>
        <AppHeader title="Cart" componentId={this.props.componentId} cart />
        {cart.length === 0 ? (
          <AppView stretch flex center>
            <AppText>No Products</AppText>
          </AppView>
        ) : (
          <>
            <RowItems
              leftItem={<AppText color="grey">Product Name </AppText>}
              rightItem={<AppText color="grey"> Total </AppText>}
              paddingVertical={5}
              borderBottomColor="grey"
              borderBottomWidth={1}
              marginHorizontal={5}
            />
            <AppScrollView stretch center paddingBottom={30} backgroundColor="white">
              {this.props.cart.map((item, index) => (
                <CartItem data={item} />
              ))}
            </AppScrollView>
            <AppView
              stretch
              center
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
              }}
              paddingVertical={10}
              elevation={3}
              borderTopWidth={1}
              borderTopColor="grey"
            >
              <AppText color="primary">
                Total Price: {this.props.cartPrice}
              </AppText>
            </AppView>
          </>
        )}
      </AppView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onAddToCart: product => dispatch(addProductToCart(product)),
});
const mapStateToProps = state => ({
  cart: state.shoppingCart.cart,
  cartPrice: state.shoppingCart.totalPrice,
  totalCounter: state.shoppingCart.totalCounter,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShoppingCart);
