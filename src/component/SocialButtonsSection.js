import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import { LoginManager } from 'react-native-fbsdk';
import { AppView, AppText, AppNavigation, showError } from '../common';
import SocialButton from './SocialButton';
import { API_ENDPOINT } from '../utils/config';
import { setCurrentUser } from '../actions/AuthActions';

class SocialSection extends Component {
  // signInFacebook = async () => {
  //   try {
  //     await LoginManager.logOut();
  //     const result = await LoginManager.logInWithReadPermissions([
  //       'public_profile',
  //       'email',
  //     ]);

  //     if (result && !result.isCancelled) {
  //       const AccessToken = require('react-native-fbsdk/js/FBAccessToken');
  //       const token = await AccessToken.getCurrentAccessToken();

  //       this.authFb(token.accessToken, token);
  //     }
  //     return;
  //   } catch (error) {
  //     setTimeout(() => {
  //       showError(error.message);
  //     }, 100);
  //   }
  // };

  // authFb = async (accessToken, token) => {
  //   try {
  //     const response = await axios.post(`${API_ENDPOINT}auth/fblogin`, {
  //       client_id: 2,
  //       client_secret: 'w2CRhJBYLAWXbzitqQ568YXCkwg8pMFIq9ya4U86',
  //       access_token: accessToken,
  //     });

  //     console.log('response ---->>>>>>>>>>>>>>>>', response);

  //     if (response.data) {
  //       this.props.setCurrentUser(response.data);
  //     }
  //   } catch (error) {
  //     showError(error[1].message);
  //   }
  // };

  render() {
    const color = 'white';
    const iconSize = 9;
    const textSize = 5;
    const { signIn } = this.props;
    return (
      <AppView stretch centerX {...this.props}>
        <AppText
          marginBottom={this.props.titleMarginBottom || 8}
          color="darkgrey"
          size={5}
        >
          {this.props.text}
        </AppText>
        <AppView stretch>
          <SocialButton
            name="facebook-square"
            type="ant"
            color={color}
            backgroundColor="#3B5998"
            title={
              signIn ? I18n.t('sign-in-facebook') : I18n.t('sign-up-facebook')
            }
            iconSize={iconSize}
            textSize={textSize}
            stretch
            // onPress={this.signInFacebook}
            marginBottom={5}
          />
        </AppView>
      </AppView>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: bindActionCreators(setCurrentUser, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SocialSection);
