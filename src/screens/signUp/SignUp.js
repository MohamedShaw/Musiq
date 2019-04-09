import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from 'react-native-i18n';
import {
  AppView,
  AppButton,
  AppScrollView,
  AppInput,
  AppText,
  AppForm,
  AppPicker,
  AppNavigation,
} from '../../common';
import { AppHeader } from '../../component';
import { validationSchema } from './validation';
import { API_ENDPOINT_GATEWAY } from '../../utils/config';
import { showError } from '../../common/utils/localNotifications';
import { signUp } from '../../actions/AuthActions';
import colors from '../../common/defaults/colors';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.lastNameRef = React.createRef();
    this.firstNameRef = React.createRef();
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
    this.userNameRef = React.createRef();
  }

  onSubmit = async (values, { setSubmitting }) => {
    this.props.signUp(values, setSubmitting);
  };

  renderUserName = injectFormProps => (
    <AppInput
      {...injectFormProps('username')}
      ref={this.userNameRef}
      nextInput={this.emailRef}
      borderWidth={1}
      borderRadius={5}
      label={I18n.t('signup-usename')}
    />
  );

  renderEmail = injectFormProps => (
    <AppInput
      {...injectFormProps('email')}
      ref={this.emailRef}
      nextInput={this.passwordRef}
      borderWidth={1}
      borderRadius={5}
      label={I18n.t('signup-email')}
    />
  );

  renderConfirmPassInput = injectFormProps => (
    <AppInput
      {...injectFormProps('password')}
      secure
      showSecureEye
      ref={this.passwordRef}
      nextInput={this.firstNameRef}
      borderWidth={1}
      borderRadius={5}
      label={I18n.t('signup-password')}
    />
  );

  renderFirstName = injectFormProps => (
    <AppInput
      {...injectFormProps('first_name')}
      ref={this.firstNameRef}
      nextInput={this.lastNameRef}
      borderWidth={1}
      borderRadius={5}
      label={I18n.t('signup-first-name')}
    />
  );

  renderLastName = injectFormProps => (
    <AppInput
      {...injectFormProps('last_name')}
      ref={this.lastNameRef}
      borderWidth={1}
      borderRadius={5}
      label={I18n.t('signup-last-name')}
    />
  );

  renderSubmitButton = (isSubmitting, handleSubmit) => (
    <AppButton
      title={I18n.t('signup-create-account')}
      stretch
      height={7}
      onPress={handleSubmit}
      linear
      processing={isSubmitting}
    />
  );

  renderForm = ({
    injectFormProps,
    isSubmitting,
    handleSubmit,
    setFieldValue,
    validateField,
  }) => (
    <AppScrollView flex stretch paddingBottom={10}>
      <AppView flex center stretch paddingHorizontal={10} marginTop={30}>
        {this.renderUserName(injectFormProps)}
        {this.renderEmail(injectFormProps)}
        {this.renderConfirmPassInput(injectFormProps)}
        {this.renderFirstName(injectFormProps)}
        {this.renderLastName(injectFormProps)}

        {this.renderSubmitButton(isSubmitting, handleSubmit)}
      </AppView>
    </AppScrollView>
  );

  render() {
    const { connected } = this.props;
    if (!connected) {
      return (
        <AppView flex stretch>
          <AppHeader title={I18n.t('signup-create-account')} />
          <NoInternet />
        </AppView>
      );
    }

    return (
      <AppView flex stretch>
        <AppHeader title={I18n.t('signup-create-account')} />

        <AppForm
          schema={{
            username: '',
            last_name: '',
            first_name: '',
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          render={this.renderForm}
          onSubmit={this.onSubmit}
        />
      </AppView>
    );
  }
}

const mapStateToProps = state => ({
  connected: state.network.isConnected,
});

const mapDispatchToProps = dispatch => ({
  signUp: bindActionCreators(signUp, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUp);
