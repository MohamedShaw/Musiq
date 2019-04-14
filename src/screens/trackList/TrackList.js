import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  FlatList,
} from 'react-native';
import I18n from 'react-native-i18n';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppButton, AppIcon, AppView, AppText, AppList } from '../../common';
import { AppHeader, ProductCard, AppLogoutModal } from '../../component';
import { API_ENDPOINT } from '../../utils/config';
import { logout } from '../../actions/AuthActions';

class TrackList extends Component {
  state = {
    isLogOutVisible: false,
  };

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
            // this.props.logout();
            this.setState({
              isLogOutVisible: true,
            });
          }}
        />
        <AppLogoutModal
          isVisible={this.state.isLogOutVisible}
          message={I18n.t('password-changed-success')}
          changeState={v => {
            this.setState({
              isLogOutVisible: v,
            });
          }}
        />
      </AppView>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
});
const mapDispatchToProps = dispatch => ({
  logout: bindActionCreators(logout, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrackList);
