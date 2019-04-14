import React from 'react';
import { AppButton, AppIcon, AppText, AppView, AppImage } from '../common';
import store from '../store';

export default props => {
  const {
    name,
    type,
    color,
    iconSize,
    textSize,
    title,
    image,
    ...rest
  } = props;
  return (
    <AppButton {...rest} center={false} row>
      {!image ? (
        <AppIcon name={name} type={type} size={iconSize} color={color} />
      ) : (
        <AppImage
          source={google}
          resizeMode="contain"
          equalSize={4.7}
          centerY
        />
      )}
      <AppView stretch center flex>
        <AppText color={color} size={textSize} centerX bold>
          {title}
        </AppText>
      </AppView>
    </AppButton>
  );
};
