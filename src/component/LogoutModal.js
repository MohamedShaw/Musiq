import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../actions/AuthActions';
import { AppView, AppText, AppModal, AppButton } from '../common';

class LogoutModal extends Component {
  render() {
    const { isVisible, ...rest } = this.props;

    return (
      <AppModal
        animationIn="bounceIn"
        animationOut="bounceOut"
        isVisible={isVisible}
        {...rest}
      >
        <AppView
          width={70}
          backgroundColor="white"
          paddingVertical={7}
          borderRadius={5}
          center
        >
          <AppText center bold>
            {I18n.t('log-out')}
          </AppText>
          <AppText
            center
            lineHeight={8.5}
            marginHorizontal={10}
            color="#5F5F5F"
            marginTop={5}
          >
            {I18n.t('log-out-text')}
          </AppText>

          <AppView row center ph={4} paddingTop={7}>
            <AppButton
              title={I18n.t('log-out-confrim')}
              touchableOpacity
              onPress={() => {
                this.props.logout();
                this.props.changeState(false);
              }}
              flex
              height={6}
              marginHorizontal={3}
            />
            <AppButton
              flex
              title={I18n.t('log-out-cancel')}
              touchableOpacity
              onPress={() => this.props.changeState(false)}
              backgroundColor="#ACB5BB"
              height={6}
              marginHorizontal={3}
            />
          </AppView>
        </AppView>
      </AppModal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: bindActionCreators(logout, dispatch),
});

export default connect(
  null,
  mapDispatchToProps,
)(LogoutModal);
