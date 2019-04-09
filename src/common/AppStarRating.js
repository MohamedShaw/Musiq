import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import StarRating from 'react-native-star-rating';

import {
  responsiveFontSize,
  moderateScale,
} from './utils/responsiveDimensions';
import Colors from './defaults/colors';

class AppStarRating extends Component {
  static propTypes = {
    size: PropTypes.number,
  };

  static defaultProps = {
    size: 8,
  };

  render() {
    const {
      rate,
      size,
      rtl,
      containerStyle,
      starStyle,
      starPaddingHorizontal,
      ...rest
    } = this.props;

    return (
      <StarRating
        disabled
        maxStars={5}
        rating={rate}
        starSize={responsiveFontSize(size)}
        emptyStarColor={Colors.star}
        fullStarColor={Colors.star}
        {...rest}
        containerStyle={{
          ...containerStyle,
          transform: [
            {
              scaleX: rtl ? -1 : 1,
            },
          ],
        }}
        starStyle={{
          ...starStyle,
          paddingHorizontal: starPaddingHorizontal || 0,
        }}
      />
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps)(AppStarRating);
