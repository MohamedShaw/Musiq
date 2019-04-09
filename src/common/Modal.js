import React, { Component } from 'react';
import { Platform, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import NativeModal from 'react-native-modal';

// const ExtraDimensions = require('react-native-extra-dimensions-android');

const height = Dimensions.get('screen').height;

class Modal extends Component {
  static propTypes = {
    closeable: PropTypes.bool,
  };

  static defaultProps = {
    closeable: true,
  };

  render() {
    const { closeable, lock, ...rest } = this.props;

    return (
      <NativeModal
        backdropOpacity={0.8}
        {...rest}
        onRequestClose={() => {
          this.props.changeState(lock || !closeable);
        }}
        useNativeDriver
        onBackdropPress={() => {
          if (Platform.OS === 'ios') {
            this.props.changeState(lock || !closeable);
          }
        }}
        onBackButtonPress={() => this.props.changeState(lock || !closeable)}
        style={{
          margin: 0,
          padding: 0,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height,
        }}
      >
        {this.props.children}
      </NativeModal>
    );
  }
}

export default Modal;
