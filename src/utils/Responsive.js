import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const responsiveHeight = h => Math.round(height * (h / 100));

export const responsiveWidth = w => Math.round(width * (w / 100));

export const moderateScale = (size, factor = 0.5) =>
  Math.round(size + (responsiveWidth(size) - size) * factor);

export const responsiveFontSize = (f, factor = 0.5) =>
  f + (responsiveWidth(f) - f) * factor;
