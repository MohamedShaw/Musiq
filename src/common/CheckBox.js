import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RectButton } from 'react-native-gesture-handler';

// import { copyMethodsToClass } from './utils/helpers';
// import Base from './Base';
import View from './View';
import Text from './Text';
import Icon from './Icon';
// import Theme from '../theme/Theme';

import { getTheme } from "./Theme";

import {
  BasePropTypes,
  marginStyles,
} from "./Base";

import { responsiveWidth } from './utils/responsiveDimensions';

class CheckBox extends Component {
  static propTypes = {
    // ...Base.propTypes,
    // ...BasePropTypes,
    checked: PropTypes.bool,
    size: PropTypes.number,
    activeColor: PropTypes.string,
    normalColor: PropTypes.string,
    labelColor: PropTypes.string,
    onPress: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.bool,
    ]),
    index: PropTypes.number,
    label: PropTypes.string,
    labelSize: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    customActiveRenderer: PropTypes.func,
  };

  static defaultProps = {
    checked: false,
    ...getTheme().checkBox,
    onPress: () => {},
  };

  render() {
    const {
      size,
      labelSize,
      labelColor,
      label,
      onPress,
      style,
      checked,
      activeColor,
      normalColor,
      value,
      index,
      customActiveRenderer,
      ...rest
    } = this.props;

    const color = checked ? activeColor : normalColor;

    return (
      <RectButton
        onPress={() => {
          onPress(value, index);
        }}
        style={[marginStyles(rest)]}
      >
        <View row style={style}>
          <View
            bc={color}
            bw={1.5}
            mr={5}
            center
            borderRadius={4}
            style={[
              {
                width: responsiveWidth(size * 0.9),
                height: responsiveWidth(size * 0.9),
              },
            ]}
          >
            {checked ? (
              customActiveRenderer ? (
                customActiveRenderer(size, color)
              ) : (
                <Icon
                  name="check"
                  type="entypo"
                  size={size * 1.2}
                  color={color}
                />
              )
            ) : null}
          </View>
          <Text size={labelSize || size} color={labelColor}>
            {label}
          </Text>
        </View>
      </RectButton>
    );
  }
}

export default connect()(CheckBox);