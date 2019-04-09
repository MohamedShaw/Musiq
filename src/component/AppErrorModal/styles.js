import { StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  moderateScale,
  responsiveFontSize,
} from '../../common/utils/responsiveDimensions';

export default StyleSheet.create({
  modalContentContainer: {
    backgroundColor: 'white',
    alignSelf: 'center',
    // height: responsiveHeight(55),
    // paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(2),
  },
  errorModalText: {
    color: '#4A4A4A',
    lineHeight: responsiveFontSize(9),
  },
});
