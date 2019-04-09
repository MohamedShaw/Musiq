import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, SafeAreaView } from 'react-native';

import { connect } from 'react-redux';

import { Navigation } from 'react-native-navigation';
import {
  AppView,
  AppText,
  AppButton,
  AppIcon,
  getColors,
  AppNavigation,
} from '../common';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 54 : 56;

class Header extends Component {
  static propTypes = {
    hideBack: PropTypes.bool,
    rowItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
  };

  static defaultProps = {
    hideBack: false,
    rowItems: [],
  };

  goBack = () => {
    if (this.props.backHandler) {
      this.props.backHandler();
    } else {
      AppNavigation.pop();
    }
  };

  renderRight = () => {
    const { rowItems } = this.props;

    if (rowItems.length > 0) {
      return (
        <AppView row stretch paddingHorizontal={10}>
          {rowItems.map(item =>
            React.cloneElement(item, {
              key: String(Math.random()),
            }),
          )}
        </AppView>
      );
    }

    return <AppView stretch flex />;
  };

  renderCounter = () => {
    if (this.props.totalCounter > 0) {
      return (
        <AppView
          flex
          center
          circleRadius={5}
          backgroundColor="#195945"
          style={{
            position: 'absolute',
            top: 3,
            right: 2,
          }}
        >
          <AppText
            color={this.props.totalCounter <= 98 ? 'white' : 'red'}
            numberOfLines={1}
            size={this.props.totalCounter >= 70 ? 4 : 5}
          >
            {this.props.totalCounter <= 98 ? this.props.totalCounter : '+99'}
          </AppText>
        </AppView>
      );
    }
  };

  renderCart = () => {
    const { cart, totalCounter } = this.props;

    return (
      <AppView stretch marginHorizontal={5}>
        <AppButton
          leftIcon={
            <AppIcon
              name="shopping-cart"
              type="font-awesome"
              size={12}
              color="darkgrey"
            />
          }
          backgroundColor="transparent"
          size={8}
          ph={10}
          onPress={() => {
            AppNavigation.push('shoppingCart');
          }}
          flex
        />

        {this.renderCounter()}
      </AppView>
    );
  };

  renderLeft = () => {
    const { menu, hideBack } = this.props;

    if (menu)
      return (
        <AppButton
          leftIcon={<AppIcon name="menu" type="entypo" size={13} />}
          backgroundColor="transparent"
          size={8}
          ph={10}
          onPress={() => {}}
          flex
        />
      );

    if (hideBack) {
      return <AppView stretch flex />;
    }

    return (
      <AppView flex center>
        <AppButton
          flex
          color="foreground"
          leftIcon={<AppIcon name="ios-arrow-back" type="ion" size={12} />}
          onPress={this.goBack}
          paddingHorizontal={8}
          backgroundColor="transparent"
        />
      </AppView>
    );
  };

  render() {
    const { title, flat, cart } = this.props;
    return (
      <SafeAreaView style={{ backgroundColor: 'white', alignSelf: 'stretch' }}>
        <AppView
          stretch
          style={{
            height: APPBAR_HEIGHT,
          }}
          row
          spaceBetween
          borderBottomColor="inputBorderColor"
          borderBottomWidth={0.5}
        >
          {this.props.lang === 'en' ? (
            <>
              {this.renderLeft()}
              <AppView flex={3} center>
                <AppText size={7} bold numberOfLines={1}>
                  {title}
                </AppText>
              </AppView>
              {cart ? this.renderCart() : this.renderRight()}
            </>
          ) : (
            <>
              {cart ? this.renderCart() : this.renderRight()}

              <AppView flex={3} center>
                <AppText size={7} bold numberOfLines={1}>
                  {title}
                </AppText>
              </AppView>
              {this.renderLeft()}
            </>
          )}
        </AppView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  totalCounter: state.shoppingCart.totalCounter,
  lang: state.lang.lang,
});

export default connect(
  mapStateToProps,
  null,
)(Header);
