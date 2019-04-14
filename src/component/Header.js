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
              {cart ? this.renderCart() : this.renderRight()}

              <AppView flex={3} center>
                <AppText size={7} bold numberOfLines={1}>
                  {title}
                </AppText>
              </AppView>
              {this.renderLeft()}
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
  lang: state.lang.lang,
});

export default connect(
  mapStateToProps,
  null,
)(Header);
