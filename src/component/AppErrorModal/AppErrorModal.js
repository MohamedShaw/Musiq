import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { moderateScale } from '../../common/utils/responsiveDimensions';
import {
  AppView,
  AppText,
  AppButton,
  AppIcon,
  AppModal,
  AppImage,
  getColors,
} from '../../common';
import styles from './styles';

class AppErrorModal extends Component {
  renderInvalidModal = () => {
    const { errorMessage, visible, fromSignIn, ...rest } = this.props;

    return (
      <AppModal
        animationIn="bounceIn"
        animationOut="bounceOut"
        hideModalContentWhileAnimating
        {...rest}
        isVisible={visible}
      >
        <AppView
          paddingHorizontal={10}
          borderRadius={2}
          stretch
          backgroundColor="white"
          style={styles.modalContentContainer}
          width={80}
        >
          <AppView centerX stretch paddingTop={8}>
            <AppIcon
              name="warning"
              type="font-awesome"
              size={28}
              color="#4A4A4A"
            />
          </AppView>
          <AppView stretch centerX paddingVertical={5}>
            {errorMessage.map((item, index) => (
              <AppText
                lineHeight={10.5}
                size={6}
                center
                marginTop={3}
                style={styles.errorModalText}
                key={index}
              >
                {item}
              </AppText>
            ))}
          </AppView>

          <AppView stretch marginBottom={5} paddingTop={5}>
            <AppButton
              touchableOpacity
              title={fromSignIn ? I18n.t('skip') : I18n.t('try-it-again')}
              stretch
              height={7}
              onPress={() => {
                if (this.props.onConfirm) {
                  this.props.onConfirm();
                } else {
                  this.props.changeState(false);
                }
              }}
            />
          </AppView>
        </AppView>
      </AppModal>
    );
  };

  render() {
    return <React.Fragment>{this.renderInvalidModal()}</React.Fragment>;
  }
}

export default AppErrorModal;
