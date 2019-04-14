import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  AppView,
  AppText,
  AppInput,
  AppScrollView,
  AppButton,
  AppForm,
  AppNavigation,
} from '../../common';
import Colors from '../../common/defaults/colors';
import { AppErrorModal, SocialButtonsSection } from '../../component';
import { validationSchema } from './validation';
import { signIn, resetLoginError } from '../../actions/AuthActions';

class SiginIn extends Component {
  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.password = React.createRef();
  }

  state = {
    showInvalidUserModal: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        showInvalidUserModal: true,
      });
    }
  }

  renderForm = ({ injectFormProps, handleSubmit, isSubmitting }) => (
    <AppView stretch marginTop={12} marginBottom={10}>
      <AppInput
        label={I18n.t('email-or-phone')}
        {...injectFormProps('email')}
        email
        ref={this.email}
        nextInput={this.password}
      />
      <AppInput
        label={I18n.t('password')}
        secure
        showSecureEye
        ref={this.password}
        {...injectFormProps('password')}
      />
      <AppView stretch row reverse marginTop={-6}>
        <AppButton
          paddingVertical={1}
          paddingHorizontal={0}
          marginBottom={1}
          transparent
          onPress={() => {
            AppNavigation.push({
              name: 'forgetPassword',
            });
          }}
          title={I18n.t('forgot-password')}
          size={5}
        />
      </AppView>
      <AppButton
        marginTop={5}
        stretch
        borderRadius={7}
        processing={isSubmitting}
        onPress={handleSubmit}
        title={I18n.t('login')}
      />
    </AppView>
  );

  renderSignUpButton = () => (
    <AppView row marginBottom={5}>
      <AppText size={5} bold>
        {I18n.t('new-user')}
      </AppText>
      <AppButton
        transparent
        onPress={() => {
          AppNavigation.push({
            name: 'signUp',
          });
        }}
      >
        <AppText size={5} bold color={Colors.primary}>
          {I18n.t('create-account')}
        </AppText>
      </AppButton>
    </AppView>
  );

  onSubmit = async (values, { setSubmitting }) => {
    this.props.onSignIn(values, setSubmitting);
  };

  render() {
    return (
      <>
        <AppScrollView
          flex
          stretch
          center
          paddingTop={10}
          paddingHorizontal={7}
          flexGrow
        >
          <AppText size={12} bold>
            {I18n.t('welcome')}
          </AppText>
          <AppText size={5} marginTop={3} color="darkgrey">
            {I18n.t('you-have-to-login')}
          </AppText>

          <AppForm
            schema={{
              email: '',
              password: '',
            }}
            validationSchema={validationSchema}
            render={this.renderForm}
            onSubmit={this.onSubmit}
          />

          {/* <SocialButtonsSection /> */}
          <AppView flex />
          {this.renderSignUpButton()}
          <AppErrorModal
            visible={this.state.showInvalidUserModal}
            changeState={v => {
              this.props.onResetLoginError();
              this.setState({
                showInvalidUserModal: v,
              });
            }}
            errorMessage={[this.props.error]}
            onConfirm={() => {
              this.props.onResetLoginError();
              this.setState({
                showInvalidUserModal: false,
              });
            }}
          />
        </AppScrollView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  error: state.auth.error,
});
const mapDispatchToProps = dispatch => ({
  onSignIn: bindActionCreators(signIn, dispatch),
  onResetLoginError: bindActionCreators(resetLoginError, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SiginIn);
