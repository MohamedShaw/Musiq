import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';

const { roundToNearestPixel } = PixelRatio;

const decorateHeights = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const { width: windowWidth } = Dimensions.get('window');
const windowHeight = Dimensions.get('window').height - decorateHeights;

const { width: screenWidth } = Dimensions.get('screen');
const screenHeight = Dimensions.get('screen').height - decorateHeights;

export const aspectRatio = () => windowHeight / windowWidth;

export const responsiveWidth = w =>
  roundToNearestPixel(windowWidth * (w / 100));

export const responsiveHeight = h =>
  roundToNearestPixel(windowHeight * (h / 100));

export const moderateScale = (size, factor = 0.5) =>
  roundToNearestPixel(size + (responsiveWidth(size) - size) * factor);

export const responsiveFontSize = (f, factor = 0.5) =>
  roundToNearestPixel(f + (responsiveWidth(f) - f) * factor);

export { windowWidth, windowHeight, screenWidth, screenHeight };
