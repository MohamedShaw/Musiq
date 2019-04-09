import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RectButton } from 'react-native-gesture-handler';

import { TouchableOpacity } from 'react-native';
import { marginStyles } from './Base';
import View from './View';
import Text from './Text';
import Icon from './Icon';
import { getTheme } from './Theme';
// TODO: Add custom button (for different radio shapes)
// TODO: REFACTOR
class RadioButton extends Component {
  static propTypes = {
    // ...Base.propTypes,
    selected: PropTypes.bool,
    size: PropTypes.number,
    activeColor: PropTypes.string,
    normalColor: PropTypes.string,
    labelColor: PropTypes.string,
    onPress: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    index: PropTypes.number,
    label: PropTypes.string,
    labelSize: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    touchableOpacity: PropTypes.bool,
  };

  static defaultProps = {
    selected: false,
    size: getTheme().radioButton.size,
    activeColor: getTheme().radioButton.activeColor,
    normalColor: getTheme().radioButton.normalColor,
    labelColor: getTheme().radioButton.labelColor,
    onPress: () => {},
  };

  render() {
    const {
      selected,
      size,
      activeColor,
      normalColor,
      value,
      index,
      onPress,
      label,
      labelSize,
      labelColor,
      style,
      touchableOpacity,
      stretch,
      ...rest
    } = this.props;

    const color = selected ? activeColor : normalColor;

    const Container = touchableOpacity ? TouchableOpacity : RectButton;
    return (
      <Container
        onPress={() => {
          onPress(value, index);
        }}
        style={[
          marginStyles(this.props),
          { alignSelf: stretch ? 'stretch' : null },
        ]}
      >
        <View row {...rest} style={style}>
          <View
            bc={selected ? color : stretch && '#D8D8D8'}
            bw={2}
            circle
            circleRadius={size}
            mr={5}
            center
          >
            {selected ? (
              <View circle circleRadius={size * 0.5} backgroundColor={color} />
            ) : (
              <View circle circleRadius={size * 0.4} backgroundColor="grey" />
            )}
          </View>
          <View row>
            {this.props.icon && (
              <Icon
                name={this.props.name}
                type={this.props.type}
                size={8}
                // marginTop={2}
                marginHorizontal={3}
              />
            )}
            <Text
              size={labelSize || size}
              color={labelColor}
              marginHorizontal={touchableOpacity && 2}
            >
              {label}
            </Text>
          </View>
        </View>
      </Container>
    );
  }
}

export default connect()(RadioButton);
