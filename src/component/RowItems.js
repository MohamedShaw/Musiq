import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import PropTypes from 'prop-types';

import {
  AppView,
  AppText,
  AppButton,
  AppImage,
  AppIcon,
  getTheme,
} from '../common';

class ProviderCardInfo extends Component {
  static propTypes = {
    name: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number,
    textSize: PropTypes.number,
    text: PropTypes.string,
    nameLeft: PropTypes.string,
    type: PropTypes.string,
    typeLeft: PropTypes.string,
    sizeLeft: PropTypes.number,
    textMargin: PropTypes.number,
    borderBottomcolor: PropTypes.string,
    borderBottomWidth: PropTypes.number,
    onPress: PropTypes.func,
    colorLeft: PropTypes.string,
    leftItem: PropTypes.node,
    rightItem: PropTypes.node,

    transparent: PropTypes.bool,
    hideArrow: PropTypes.bool,
  };

  static defaultProps = {
    color: '#484848',
    size: 6,
    textSize: 6,
    nameLeft: 'ios-arrow-back',
    typeLeft: 'ion',
    sizeLeft: 8,
    textMargin: 10,

    colorLeft: '#BFBFBF',
    hideArrow: true,
  };

  renderLeftIcon = c => {
    const { leftItem, size } = this.props;

    return React.cloneElement(leftItem, {
      size: leftItem.props.size || size * 1.2,
      color: leftItem.props.color || c,
    });
  };

  renderRightIcon = c => {
    const { rightItem, size } = this.props;

    return React.cloneElement(rightItem, {
      size: rightItem.props.size || size * 1.2,
      color: rightItem.props.color || c,
    });
  };

  render() {
    const {
      name,
      color,
      size,
      textSize,
      text,
      nameLeft,
      type,
      typeLeft,
      sizeLeft,
      borderBottomcolor,
      borderBottomWidth,
      onPress,
      colorLeft,
      textMargin,
      leftItem,
      rightItem,
      paddingHorizontal,
      hideArrow,

      ...rest
    } = this.props;

    return (
      <AppView
        {...rest}
        stretch
        borderBottomcolor={borderBottomcolor}
        borderBottomWidth={borderBottomWidth}
        onPress={onPress}
      >
        <AppView stretch spaceBetween row paddingHorizontal={paddingHorizontal}>
          {rightItem ? (
            this.renderRightIcon()
          ) : (
            <AppView row paddingHorizontal={6}>
              <AppIcon name={name} type={type} size={size} />
              <AppText
                color={color}
                size={textSize}
                marginHorizontal={textMargin}
              >
                {text}
              </AppText>
            </AppView>
          )}

          {leftItem
            ? this.renderLeftIcon()
            : hideArrow && (
                <AppIcon
                  name={nameLeft}
                  type={typeLeft}
                  size={sizeLeft}
                  color={colorLeft}
                  paddingHorizontal={6}
                />
              )}
        </AppView>
      </AppView>
    );
  }
}

export default ProviderCardInfo;
