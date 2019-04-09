import React, { PureComponent } from 'react';
import {
  View as NativeView,
  TextInput as NativeInput,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  BasePropTypes,
  dimensionsStyles,
  paddingStyles,
  fontSizeStyles,
  fontFamilyStyles,
  textDirectionStyles,
  colorStyles,
  borderStyles,
  borderRadiusStyles,
  backgroundColorStyles,
  elevationStyles,
} from './Base';
import View from './View';
import InputError from './micro/InputError';
import { getTheme } from './Theme';
import { convertNumbers } from './utils/numbers';
import { responsiveHeight } from './utils/responsiveDimensions';

class TextArea extends PureComponent {
  static propTypes = {
    ...BasePropTypes,
    initialValue: PropTypes.string,
    name: PropTypes.string,
    onChangeText: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    placeholder: PropTypes.string,
    placeholderColor: PropTypes.string,
    error: PropTypes.string,
    noValidation: PropTypes.bool,
  };

  static defaultProps = {
    ...getTheme().textArea,
  };

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    this.state = {
      text: props.initialValue,
    };
  }

  onChangeText = text => {
    const { name, onChangeText } = this.props;

    this.setState({
      text,
    });

    if (onChangeText) {
      if (name) onChangeText(name, text);
      else onChangeText(text);
    }
  };

  onBlur = () => {
    const { name, onBlur } = this.props;

    if (onBlur) {
      if (name) onBlur(name, this.state.text);
      else onBlur(this.state.text);
    }
  };

  onFocus = () => {
    const { name, onFocus } = this.props;

    if (onFocus) {
      if (name) onFocus(name, this.state.text);
      else onFocus(this.state.text);
    }
  };

  onSubmitEditing = () => {
    const { name, onSubmitEditing } = this.props;

    if (onSubmitEditing) {
      if (name) onSubmitEditing(name, this.state.text);
      else onSubmitEditing(this.state.text);
    }
  };

  focus = () => {
    this.inputRef.current.focus();
  };

  blur = () => {
    this.inputRef.current.blur();
  };

  clear = () => {
    this.inputRef.current.clear();
  };

  render() {
    const {
      placeholder,
      placeholderColor,
      rtl,
      translateNumbers,
      noValidation,
      error,
      size,
      flex,
      margin,
      marginHorizontal,
      marginVertical,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      underlineColor,
    } = this.props;

    return (
      <View
        stretch
        flex={flex}
        margin={margin}
        marginHorizontal={marginHorizontal}
        marginVertical={marginVertical}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight}
      >
        <NativeInput
          ref={this.inputRef}
          // {...rest}
          placeholder={convertNumbers(
            placeholder,
            translateNumbers ? rtl : false,
          )}
          placeholderTextColor={placeholderColor}
          multiline
          blurOnSubmit
          value={this.state.text}
          underlineColorAndroid={underlineColor}
          onChangeText={this.onChangeText}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onSubmitEditing={this.onSubmitEditing}
          style={[
            dimensionsStyles(this.props),
            backgroundColorStyles(this.props),
            textDirectionStyles(this.props),
            fontSizeStyles(this.props),
            fontFamilyStyles(this.props),
            colorStyles(this.props),
            borderStyles(this.props),
            borderRadiusStyles(this.props),
            elevationStyles(this.props),
            {
              alignSelf: 'stretch',
              textAlignVertical: 'top',
              padding: 0,
            },
            paddingStyles(this.props),
          ]}
        />
        {!noValidation ? <InputError error={error} size={size} /> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)(TextArea);
