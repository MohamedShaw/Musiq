import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  FlatList,
} from 'react-native';
import I18n from 'react-native-i18n';

import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import Axois from 'axios';
import {
  AppButton,
  moderateScale,
  AppIcon,
  AppView,
  AppScrollView,
  AppText,
  AppSpinner,
  getColors,
  AppList,
} from '../../common';
import cover from '../../assets/imgs/cover.png';
import { AppHeader, ProductCard } from '../../component';
import { API_ENDPOINT } from '../../utils/config';

class TrackList extends Component {
  render() {
    return (
      <AppView stretch flex>
        <AppHeader title="Tracks" hideBack />

        <AppList
          flatlist
          flex
          stretch
          idPathInData="id"
          paging
          apiRequest={{
            url: `${API_ENDPOINT}tracks`,

            responseResolver: response => {
              console.log('response =====', response.data.list.data);

              return {
                data: response.data.list.data,
                pageCount: response.data.list.last_page,
              };
            },
            onError: error => I18n.t('ui-error-happened'),
          }}
          rowRenderer={data => <ProductCard data={data} />}
          refreshControl={this.props.productList}
          noResultsComponent={
            <AppView>
              <AppText> No Data</AppText>
            </AppView>
          }
        />
        <AppButton
          style={{ position: 'absolute', right: 10, bottom: 20 }}
          leftIcon={
            <AppIcon name="logout" type="ant" size={10} color="white" />
          }
          circleRadius={20}
          onPress={() => {
            alert('log out');
          }}
        />
      </AppView>
    );
  }
}

const mapStateToProps = state => ({
  currentLocation: state.location.current,
  cart: state.shoppingCart.cart,
  currentUser: state.auth.currentUser,
});

export default connect(
  mapStateToProps,
  null,
)(TrackList);
