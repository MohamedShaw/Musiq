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
import colors from '../common/defaults/colors';

import cover from '../assets/imgs/cover.png';

import { addProductToCart } from '../actions/shoppingCart';

class ProviderCard extends Component {
  state = {
    counter: 1,
  };

  componentDidMount() {}

  // renderProviderImg = () => {
  //   const { data } = this.props;

  //   return (
  //     <AppImage
  //       stretch
  //       source={{ uri: `https://www.musiqar.com/uploads/media/${data.art}` }}
  //       resizeMode="stretch"
  //       borderRadius={10}
  //       height={15}
  //       bc="primary"
  //       bw={2}
  //     />
  //   );
  // };

  renderProductImg = () => {
    const { data, hideRate } = this.props;

    return (
      <AppImage
        stretch
        height={20}
        source={{
          uri: `https://www.musiqar.com/uploads/media/${data.art}`,
        }}
        style={{ zIndex: 10000 }}
        resizeMode="center"
      >
        <AppView
          linearBackgroundGradient={{
            start: { x: 0.5, y: 0.5 },
            end: { x: 0.5, y: 1.27 },
            locations: [0, 0.8],
            colors: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)'],
          }}
          linear
          stretch
          style={{
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 2,
            opacity: 1,
          }}
        >
          <AppView
            backgroundColor="primary"
            borderRadius={20}
            height={6}
            center
            paddingHorizontal={5}
            style={{
              position: 'absolute',
              left: 0,
            }}
            margin={5}
          >
            <AppText color="white">views :{data.views}</AppText>
          </AppView>
          <AppView
            bottom
            stretch
            // flex
            row
            spaceBetween
            paddingHorizontal={5}
            paddingVertical={4}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <AppView flex={3}>
              <AppText bold color="white" numberOfLines={1}>
                {data.title} {' / '}
                {data.tag}
              </AppText>
            </AppView>
          </AppView>
        </AppView>
      </AppImage>
    );
  };

  renderProductDetailes = () => {
    const { data } = this.props;
    return (
      <AppView stretch left>
        <AppText>Likes : {data.likes}</AppText>
        <AppText>uploader Name : {data.uploader.username}</AppText>
      </AppView>
    );
  };

  render() {
    const { style, data, ...rest } = this.props;

    return (
      <AppView
        style={style}
        backgroundColor="white"
        stretch
        // flex
        {...rest}
        marginHorizontal={3}
        paddingVertical={2}
        paddingHorizontal={2}
        onPress={() => {
          AppNavigation.push({
            name: 'productDetails',
            passProps: {
              data: this.props.data,
            },
          });
        }}
        marginTop={5}
      >
        {this.renderProductImg()}
        {this.renderProductDetailes()}
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProviderCard);
