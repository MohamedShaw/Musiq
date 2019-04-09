import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import posed from 'react-native-pose';

import { AppText, AppView } from '..';
import { getTheme } from '../Theme';

import { responsiveHeight, moderateScale } from '../utils/responsiveDimensions';

const config_ltr = {
  visible: { x: 0, opacity: 1 },
  hidden: { x: -50, opacity: 0 },
};

const config_rtl = {
  visible: { x: 0, opacity: 1 },
  hidden: { x: 50, opacity: 0 },
};

const BoxLTR = posed.View(config_ltr);
const BoxRTL = posed.View(config_rtl);

class InputError extends PureComponent {
  static propTypes = {
    size: PropTypes.number,
    sizeScale: PropTypes.number,
    error: PropTypes.string,
    rtl: PropTypes.bool,
    color: PropTypes.string,
  };

  static defaultProps = {
    ...getTheme().inputError,
    errorTextMarginHorizontal: 5,
  };

  render() {
    const Box = this.props.rtl ? BoxRTL : BoxLTR;
    const { errorTextMarginHorizontal, errorTextMarginBottom } = this.props;

    return (
      <Box
        style={{
          marginTop: moderateScale(1),
          marginBottom: errorTextMarginBottom
            ? moderateScale(2)
            : moderateScale(5),
        }}
        pose={this.props.error ? 'visible' : 'hidden'}
      >
        <AppText
          marginHorizontal={errorTextMarginHorizontal}
          color={this.props.color}
          size={this.props.size * this.props.sizeScale}
        >
          {this.props.error}
        </AppText>
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps)(InputError);
