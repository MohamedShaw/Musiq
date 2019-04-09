import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import View from './View';
import Text from './Text';
import Indicator from './Indicator';
import { getTheme } from './Theme';

import { BasePropTypes } from './Base';

const log = () => {
  console.log('Please attach a method to this component');
};

class Button extends PureComponent {
  static propTypes = {
    ...BasePropTypes,
    onPress: PropTypes.func,
    processing: PropTypes.bool,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    transparent: PropTypes.bool,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
  };

  static defaultProps = {
    row: true,
    center: true,
    onPress: log,
    linearBackgroundGradient: {
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
      locations: [0, 0.6],
      colors: ['#e46961', '#E04F46'],
    },
    ...getTheme().button,
  };

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      layoutReady: false,
    };
  }

  componentWillUnmount = () => {
    clearTimeout(this.timer);
  };

  onPress = event => {
    if (this.props.disabled) return;
    if (this.props.processing) return;

    this.props.onPress(event);
  };

  renderLeftIcon = c => {
    const { leftIcon, rightIcon, title, size } = this.props;

    return React.cloneElement(leftIcon, {
      size: leftIcon.props.size || size * 1.4,
      color: leftIcon.props.color || c,
      pr:
        leftIcon.props.pr ||
        (title || rightIcon ? (leftIcon.props.size || size) / 2 : 0),
    });
  };

  renderRightIcon = c => {
    const { leftIcon, rightIcon, title, size } = this.props;

    return React.cloneElement(rightIcon, {
      size: rightIcon.props.size || size * 1.4,
      color: rightIcon.props.color || c,
      pl:
        rightIcon.props.pl ||
        (title || leftIcon ? (rightIcon.props.size || size) / 2 : 0),
    });
  };

  renderChildren = () => {
    const {
      title,
      size,
      leftIcon,
      rightIcon,
      disabled,
      color,
      backgroundColor,
      disabledBackgroundColor,
      disabledColor,
      transparent,
      bold,
      processing,
    } = this.props;

    const bg = disabled ? disabledBackgroundColor : backgroundColor;
    const fg = disabled ? disabledColor : color;

    const c = transparent ? (color !== getTheme().button.color ? fg : bg) : fg;

    return processing ? (
      <Indicator color={c} size={size} />
    ) : (
      <React.Fragment>
        {leftIcon && this.renderLeftIcon(c)}
        <Text size={size} color={c} bold={bold} center>
          {title}
        </Text>
        {rightIcon && this.renderRightIcon(c)}
      </React.Fragment>
    );
  };

  render() {
    const {
      disabledBackgroundColor,
      disabled,
      transparent,
      children,
      style,
      linear,
      linearBackgroundGradient,
      width,
      height,
      ...rest
    } = this.props;

    const disabledProps = {};
    if (disabled) {
      disabledProps.backgroundColor = disabledBackgroundColor;
      disabledProps.elevation = 0;
      disabledProps.borderRadius = 0;
    }

    const flatProps = {};
    if (transparent) {
      flatProps.backgroundColor = 'transparent';
      flatProps.elevation = 0;
      flatProps.borderRadius = 0;
    }

    const paddingProps = {};
    if (height) {
      paddingProps.paddingVertical = 0;
    }

    const overwriteWidth =
      this.state.layoutReady &&
      this.state.width &&
      this.props.processing &&
      !width;

    const overwriteHeight =
      this.state.layoutReady &&
      this.state.height &&
      this.props.processing &&
      !height;

    return (
      <View
        width={width}
        height={height}
        {...rest}
        {...paddingProps}
        linearBackgroundGradient={linear ? linearBackgroundGradient : undefined}
        {...disabledProps}
        {...flatProps}
        onPress={this.onPress}
        onLayout={event => {
          if (this.state.layoutReady) return;

          const { width: w, height: h } = event.nativeEvent.layout;
          this.setState({
            width: w,
            height: h,
            layoutReady: true,
          });
        }}
        flexInnerTouchable={overwriteWidth}
        stretchInnerTouchable={overwriteHeight}
        style={[
          overwriteWidth ? { width: this.state.width } : null,
          overwriteHeight ? { height: this.state.height } : null,

          style,
        ]}
      >
        {children || this.renderChildren()}
      </View>
    );
  }
}

export default Button;
