import React, { Component } from 'react';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import { Navigation } from 'react-native-navigation';
import {
  AppScrollView,
  AppView,
  AppImage,
  AppText,
  AppButton,
  AppIcon,
  AppNavigation,
} from '../common';
import { RowItems } from '.';

import { addProductToCart, removeItem } from '../actions/shoppingCart';

class CartItem extends Component {
  renderAction = () => {
    const { data } = this.props;
    return (
      <AppView row stretch flex>
        <AppButton
          flex
          leftIcon={<AppIcon name="ios-add" type="ion" color="darkgrey" />}
          backgroundColor="#F0F0F0"
          onPress={() => {
            this.props.onAddToCart(data, 1);
          }}
          height={6}
        />
        <AppView
          bw={1}
          bc="grey"
          stretch
          marginHorizontal={3}
          height={6}
          center
          flex
        >
          <AppText>{data.counter}</AppText>
        </AppView>
        <AppButton
          flex
          leftIcon={<AppIcon name="minus" type="ant" color="darkgrey" />}
          backgroundColor="#F0F0F0"
          onPress={() => {
            this.props.onAddToCart(data, -1);
          }}
          height={6}
        />
      </AppView>
    );
  };

  renderRemoveProduct = () => {
    const { data } = this.props;
    return (
      <AppButton
        leftIcon={<AppIcon name="close" type="ant" size={8} color="red" />}
        backgroundColor="#F0F0F0"
        // style={{ position: 'absolute', right: 5, top: 5 }}
        onPress={() => {
          this.props.onRemoveItem(data);
        }}
        elevation={2}
        paddingVertical={2}
        paddingHorizontal={2}
        stretch
      />
    );
  };

  render() {
    const { style, data, ...rest } = this.props;

    console.log('ITEM CART', data);

    return (
      <AppView
        style={style}
        backgroundColor="white"
        stretch
        flex
        {...rest}
        marginHorizontal={5}
        paddingVertical={5}
        center
        borderBottomWidth={1}
        borderBottomColor="grey"
      >
        <RowItems
          leftItem={
            <AppText size={7} bold color="black">
              {data.name}
            </AppText>
          }
          rightItem={this.renderRemoveProduct()}
        />
        <RowItems
          leftItem={
            <AppView stretch flex>
              {this.renderAction()}
            </AppView>
          }
          rightItem={
            <AppView flex>
              <AppText>
                EGP {data.price} x {data.counter} =
              </AppText>
              <AppText>EGP {data.priceOfProdut} </AppText>
            </AppView>
          }
          paddingVertical={5}
        />
      </AppView>
    );
  }
}
const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

const mapDispatchToProps = dispatch => ({
  onAddToCart: (product, counter) =>
    dispatch(addProductToCart(product, counter)),
  onRemoveItem: item => dispatch(removeItem(item)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CartItem);
