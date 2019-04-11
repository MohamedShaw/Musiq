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
import RowItems from './RowItems';
import cover from '../assets/imgs/cover.png';

import { addProductToCart } from '../actions/shoppingCart';

class ProviderCard extends Component {
  state = {
    counter: 1,
  };

  componentDidMount() {}

  renderDetailes = () => {
    const { data } = this.props;
    return (
      <AppView stretch flex>
        <RowItems
          leftItem={
            <AppView reverse>
              <AppText>{data.tag}</AppText>
              <AppText left>{data.title}</AppText>
              <AppView row>
                <AppText> {data.views}</AppText>
                <AppIcon
                  name="controller-play"
                  type="entypo"
                  size={6}
                  color="grey"
                />
              </AppView>
            </AppView>
          }
          flex
          paddingHorizontal={5}
        />
      </AppView>
    );
  };

  renderTrackImg = () => {
    const { data, hideRate } = this.props;

    return (
      <AppView
        row
        reverse
        paddingVertical={5}
        borderBottomColor="grey"
        borderBottomWidth={1}
        paddingHorizontal={5}
      >
        <AppImage
          stretch
          equalSize={16}
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
          />
        </AppImage>
        {this.renderDetailes()}
      </AppView>
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
        onPress={() => {
          AppNavigation.push({
            name: 'PlayerScreen',
            passProps: {
              title: 2,
              filepath: `https://www.musiqar.com/uploads/tracks/${
                this.props.data.name
              }`,
              allData: this.props.listData,
              id: this.props.data.id,
            },
          });
        }}
      >
        {this.renderTrackImg()}
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
