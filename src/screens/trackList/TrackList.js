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
        <AppHeader title="Products" cart hideBack />

        <AppList
          flatlist
          flex
          stretch
          idPathInData="id"
          apiRequest={{
            url: `${API_ENDPOINT}tracks`,

            responseResolver: response => {
              console.log('response =====?>>>>>>>>>>>>>>>', response);

              return {
                data: response.data.list.data,
                pageCount: response.data.list.current_page,
              };
            },
            onError: error => I18n.t('ui-error-happened'),
          }}
          rowRenderer={data => (
            <ProductCard
              data={data}
              style={{
                marginBottom: moderateScale(8),
              }}
            />
          )}
          refreshControl={this.props.productList}
          noResultsComponent={
            <AppView>
              <AppText> No Data</AppText>
            </AppView>
          }
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
