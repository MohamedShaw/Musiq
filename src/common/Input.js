import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'react-native-i18n';
import {
  TextInput as NativeInput,
  View as RNView,
  TouchableWithoutFeedback,
  Animated,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import axios from 'axios';
import {
  BasePropTypes,
  paddingStyles,
  fontSizeStyles,
  fontFamilyStyles,
  textDirectionStyles,
  colorStyles,
  borderStyles,
} from './Base';

import { AppView, AppIcon, AppText, AppButton } from '.';
import { getTheme } from './Theme';
import InputError from './micro/InputError';
import { convertNumbers } from './utils/numbers';
import {
  moderateScale,
  responsiveHeight,
  responsiveFontSize,
} from './utils/responsiveDimensions';

const { CancelToken } = axios;

class Input extends PureComponent {
  static propTypes = {
    ...BasePropTypes,
    initialValue: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    placeholder: PropTypes.string,
    placeholderColor: PropTypes.string,
    secure: PropTypes.bool,
    leftItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    rightItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    activeColor: PropTypes.string,
    inactiveColor: PropTypes.string,
    color: PropTypes.string,
    error: PropTypes.string,
    showSecureEye: PropTypes.bool,
    nextInput: PropTypes.objectOf(PropTypes.any),
    noValidation: PropTypes.bool,
    asyncErrorResolver: PropTypes.func,
    asyncDataResolver: PropTypes.func,
  };

  static defaultProps = {
    leftItems: [],
    rightItems: [],
    masks: [],
    initialValue: '',
    ...getTheme().input,
  };

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    this.state = {
      secure: props.secure,
      text: props.initialValue,
      color: props.color || props.inactiveColor,
      isFocused: !!props.initialValue,
      isTouched: false,
      asyncConnectionError: false,
    };
    this.asyncValidateLoading = false;
    this._animatedIsFocused = new Animated.Value(props.initialValue ? 1 : 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset !== this.props.reset) {
      this.clear();
    }

    if (nextProps.error && !this.state.isTouched) {
      this.setState({
        isTouched: true,
      });
    }
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.state.text !== '' ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }

  getText = () => this.state.text;

  getAsyncValidationScheme = value => {
    if (!value) return;
    // this.setState({
    //   asyncConnectionError: false,
    // });
    if (this.asyncValidateLoading && this.source) {
      this.source.cancel('Async Validation Canceled.');
    }

    const { asyncDataResolver, asyncErrorResolver } = this.props;

    const { url, data } = asyncDataResolver(value);
    this.asyncValidateLoading = true;
    this.props.setErrorState(this.props.name, true);

    this.source = CancelToken.source();
    axios
      .put(url, data, {
        cancelToken: this.source.token,
      })
      .then(res => {
        const errText = asyncErrorResolver(res, value) || null;
        if (this.props.setError && !this.props.error) {
          this.props.setError(this.props.name, errText);
        }
        this.asyncValidateLoading = false;
        this.props.setErrorState(this.props.name, false);
        this.setState({
          isTouched: true,
          asyncConnectionError: false,
        });
      })
      .catch(error => {
        if (!axios.isCancel(error[0])) {
          this.asyncValidateLoading = false;
          this.props.setErrorState(this.props.name, false);
          this.props.setError(
            this.props.name,
            I18n.t('ui-networkConnectionError'),
          );
          this.setState({
            isTouched: true,
            asyncConnectionError: true,
          });
        }
      });
  };

  getTouchedStatus = () => this.state.isTouched;

  onChangeText = (text, noValidate) => {
    const { name, onChange, asyncDataResolver } = this.props;

    this.setState({
      text,
    });

    if (onChange) {
      if (name) onChange(name, text, !this.state.isTouched || noValidate);
      else onChange(text);
    }

    if (asyncDataResolver) {
      this.getAsyncValidationScheme(text);
    }
  };

  onBlur = () => {
    const {
      name,
      onBlur,
      color,
      inactiveColor,
      asyncDataResolver,
    } = this.props;
    if (!color) {
      this.setState({
        color: inactiveColor,
      });
    }

    if (asyncDataResolver && this.state.isTouched) {
      this.getAsyncValidationScheme(this.state.text);
    }

    if (onBlur) {
      if (name)
        onBlur(
          name,
          this.state.text,
          !!this.props.error && !!asyncDataResolver,
          !asyncDataResolver,
        );
      else onBlur(this.state.text);
    }

    this.setState({
      isFocused: false,
      isTouched: true,
    });
  };

  onFocus = () => {
    const { name, onFocus, color, activeColor, asyncDataResolver } = this.props;

    if (!color) {
      this.setState({
        color: activeColor,
      });
    }

    if (asyncDataResolver && this.state.isTouched) {
      this.getAsyncValidationScheme(this.state.text);
    }

    if (onFocus) {
      if (name) onFocus(name, this.state.text, !this.state.isTouched);
      else onFocus(this.state.text);
    }

    this.setState({
      isFocused: true,
    });
  };

  onSubmitEditing = () => {
    const { name, nextInput, onSubmitEditing } = this.props;

    if (nextInput) {
      nextInput.current.focus();
    }

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

    this.onChangeText('', true);
  };

  renderSecureEyeButton = () => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        this.setState(prevState => ({ secure: !prevState.secure }));
      }}
      style={{
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <RNView
        style={borderStyles({
          rtl: this.props.rtl,
          borderLeftColor: '#8A8A8A',
          // borderLeftWidth: 1,
        })}
      >
        <AppIcon
          size={this.props.size * 1.4}
          paddingHorizontal={5}
          type="feather"
          name={this.state.secure ? 'eye-off' : 'eye'}
          color="#8A8A8A"
        />
      </RNView>
    </TouchableOpacity>
  );

  renderErrorIcon = () => (
    <AppIcon
      color="red"
      name="error-outline"
      type="material"
      onPress={this.focus}
      marginHorizontal={5}
      size={7}
    />
  );

  renderItems = items => {
    const { size } = this.props;

    const nodes = items.map(item => {
      if (
        item.type.WrappedComponent &&
        (item.type.WrappedComponent.displayName === 'Button' ||
          item.type.WrappedComponent.displayName === 'Icon')
      ) {
        return React.cloneElement(item, {
          key: String(Math.random()),
          transparent: true,
          stretch: item.type.WrappedComponent.displayName === 'Button',
          color: item.props.color || this.state.color,
          size: item.props.size || size * 1.5,
          backgroundColor: 'transparent',
          paddingHorizontal: item.props.paddingHorizontal || size / 1.5,
          paddingVertical: 0,
        });
      }
      return React.cloneElement(item, {
        key: String(Math.random()),
      });
    });

    return nodes;
  };

  renderCover = () => (
    <TouchableWithoutFeedback
      onPress={() => {
        this.focus();
      }}
    >
      <RNView
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      />
    </TouchableWithoutFeedback>
  );

  getDistance = items => {
    let total = 0;
    const { size } = this.props;
    for (let i = 0; i < items.length; i++) {
      total +=
        (items[i].props.size || size) +
        (items[i].props.paddingHorizontal || size) +
        (items[i].props.marginHorizontal || 0);
    }
    return total * 2;
  };

  getColor = () => {
    if (!this.state.isTouched || this.props.noValidation) {
      return '#8A8A8A';
    }
    if (this.props.error) return '#FF0050';
    return 'green';
  };

  render() {
    const {
      size,
      secure,
      placeholderColor,
      width,
      height,
      backgroundColor,
      borderRadius,
      elevation,
      rtl,
      nextInput,
      showSecureEye,
      placeholder,
      translateNumbers,
      noValidation,
      error,
      flex,
      margin,
      marginHorizontal,
      marginVertical,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      borderWidth,
      borderTopWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderRightWidth,
      borderColor,
      borderTopColor,
      borderBottomColor,
      borderLeftColor,
      borderRightColor,
      email,
      phone,
      number,
      label,
      errorTextMarginHorizontal,
      errorTextMarginBottom,
      noBorder,
      maxLength,
      style,
      editable,
      ...rest
    } = this.props;

    let { leftItems, rightItems } = this.props;
    const paddingText = moderateScale(2);
    const assignedColor = this.getColor();
    const labelStyle = [
      {
        position: 'absolute',
        top: responsiveHeight(height) / 5,
        bottom: responsiveHeight(height) / 5,
        borderRadius: moderateScale(10),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: rtl ? 'flex-end' : 'flex-start',
        paddingHorizontal: paddingText,
        transform: [
          {
            translateY: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -responsiveHeight(height) / 2],
            }),
          },
          {
            scale: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.8],
            }),
          },
          {
            translateX: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [
                0,
                rtl
                  ? responsiveFontSize(size) - 15
                  : -responsiveFontSize(size) + 15,
              ],
            }),
          },
        ],
      },
      !rtl ? { left: 0 } : { right: 0 },
    ];

    if (leftItems && !leftItems.map) leftItems = [leftItems];
    if (rightItems && !rightItems.map) rightItems = [rightItems];

    let keyboardType = 'default';
    if (number) keyboardType = 'phone-pad';
    if (phone) keyboardType = 'phone-pad';
    if (email) keyboardType = 'email-address';

    const scrollFixProps = {};

    if (Platform.OS === 'android' && rtl && keyboardType === 'default') {
      scrollFixProps.multiline = true;
      scrollFixProps.maxLength = maxLength || 10000;
    }

    return (
      <AppView
        stretch
        flex={flex}
        margin={margin}
        marginHorizontal={marginHorizontal}
        marginVertical={marginVertical}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight}
        width={width}
      >
        <AppView
          style={{ overflow: 'visible' }}
          stretch
          row
          height={height}
          backgroundColor={backgroundColor}
          borderRadius={borderRadius}
          elevation={elevation}
          borderWidth={borderWidth || (noBorder ? 0 : 1)}
          borderTopWidth={borderTopWidth}
          borderBottomWidth={borderBottomWidth}
          borderLeftWidth={borderLeftWidth}
          borderRightWidth={borderRightWidth}
          borderTopColor={borderTopColor}
          borderBottomColor={borderBottomColor}
          borderLeftColor={borderLeftColor}
          borderRightColor={borderRightColor}
          borderColor={assignedColor}
          style={[{ overflow: 'visible' }, style]}
          {...(this.state.isFocused && this.props.onFocusBorderHighlight
            ? this.props.onFocusBorderHighlight
            : null)}
        >
          {leftItems.length ? this.renderItems(leftItems) : null}
          {error &&
            this.state.asyncConnectionError &&
            this.renderItems([
              <AppButton
                transparent
                backgroundColor="black"
                touchableOpacity
                leftIcon={<AppIcon name="reload1" type="ant" />}
                onPress={() => {
                  this.props.setError(this.props.name, '');
                  this.setState({
                    asyncConnectionError: false,
                  });
                  this.getAsyncValidationScheme(this.state.text);
                }}
              />,
            ])}
          <AppView flex stretch>
            {label && (
              <Animated.View pointerEvents="none" style={labelStyle}>
                <AppText pointerEvents="none" color={assignedColor} size={size}>
                  {label}
                </AppText>
              </Animated.View>
            )}
            <NativeInput
              returnKeyType={nextInput ? 'next' : 'done'}
              {...rest}
              editable={editable}
              onChange={null}
              placeholder={convertNumbers(
                placeholder,
                translateNumbers ? rtl : false,
              )}
              placeholderTextColor={placeholderColor}
              blurOnSubmit
              ref={this.inputRef}
              value={this.state.text}
              underlineColorAndroid="transparent"
              secureTextEntry={this.state.secure}
              onChangeText={this.onChangeText}
              onBlur={this.onBlur}
              keyboardType={keyboardType}
              maxLength={maxLength}
              onFocus={this.onFocus}
              onSubmitEditing={this.onSubmitEditing}
              {...scrollFixProps}
              style={[
                textDirectionStyles(this.props),
                fontSizeStyles(this.props),
                fontFamilyStyles(this.props),
                colorStyles({ color: this.state.color }),
                {
                  flex: 1,
                  alignSelf: 'stretch',
                  textAlignVertical: 'center',
                  // padding: 0,
                },
                paddingStyles(this.props),
              ]}
            />
          </AppView>

          {error && this.renderErrorIcon()}

          {rightItems.length ? this.renderItems(rightItems) : null}
          {secure && showSecureEye
            ? this.renderItems([this.renderSecureEyeButton()])
            : null}
        </AppView>

        {!noValidation ? (
          <InputError
            error={error}
            errorTextMarginHorizontal={errorTextMarginHorizontal}
            errorTextMarginBottom={errorTextMarginBottom}
            size={size}
          />
        ) : null}
      </AppView>
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
)(Input);
