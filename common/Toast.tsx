import React, {forwardRef} from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import RNToast, {
  ToastProps,
  BaseToastProps,
  BaseToast,
} from 'react-native-toast-message';

const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      contentContainerStyle={contentContainerStyle}
      text1Style={text1Style}
      text2Style={text2Style}
    />
  ),
  error: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      contentContainerStyle={contentContainerStyle}
      text1Style={text1Style}
      text2Style={text2Style}
    />
  ),
  info: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      contentContainerStyle={contentContainerStyle}
      text1Style={text1Style}
      text2Style={text2Style}
      style={infoStyle}
    />
  ),
};

const Toast: React.ForwardRefRenderFunction<ToastProps> = (props, ref) => {
  // @ts-ignore
  return <RNToast config={toastConfig} ref={ref} {...props} />;
};

const text1Style: TextStyle = {
  fontFamily: 'Inter',
  fontSize: 16,
};
const text2Style: TextStyle = {
  fontFamily: 'Inter',
  fontSize: 14,
};
const infoStyle: ViewStyle = {
  borderLeftColor: '#473B78',
};
const contentContainerStyle: ViewStyle = {
  paddingHorizontal: 15,
};

export default forwardRef(Toast);
