import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';
import RNToast from 'react-native-toast-message';
import React, {useCallback, useEffect} from 'react';
import {translate} from '../app/locales';
import {DARK_BLUE, LIGHT_BLUE} from '../app/colors';

const {width} = Dimensions.get('window');

interface ProjetXToastProps {
  message: string;
  title?: string;
  timeout: number;
  onOpen?(): void;
  onClose?(hasClick?: boolean): void;
  buttons?: {text: string; onPress(): void}[];
}

export const showToast = (props: {
  message: string;
  timeout?: number;
  title?: string;
  onOpen?(): void;
  onClose?(hasClick?: boolean): void;
  buttons?: {text: string; onPress(): void}[];
}) => {
  RNToast.show({
    type: 'custom',
    autoHide: true,
    text1: props.title,
    text2: props.message,
    visibilityTime: props.timeout || 500000,
    onPress: props.onOpen,
    onHide: props.onClose,
    props: {buttons: props.buttons},
  });
};

export const toastConfig = {
  //@ts-ignore
  custom: ({text1, text2, visibilityTime, onPress, onHide, props}) => (
    <Toast
      title={text1}
      message={text2}
      timeout={visibilityTime}
      onOpen={onPress}
      onClose={onHide}
      buttons={props.buttons}
    />
  ),
};

const Toast: React.FC<ProjetXToastProps> = ({
  message,
  title,
  timeout,
  onOpen,
  onClose,
  buttons,
}) => {
  console.log(timeout);
  const open = async () => {
    onOpen && onOpen();
    RNToast.hide();
    console.log('hide');
  };
  const dimiss = useCallback(
    async (hasClick: boolean) => {
      onClose && onClose(hasClick);
      RNToast.hide();
    },
    [onClose],
  );

  useEffect(() => {
    if (timeout) {
      setTimeout(dimiss, timeout);
    }
  }, [dimiss, timeout]);

  const DEFAULT_BUTTONS = [
    {
      text: translate('Fermer'),
      onPress: () => dimiss(true),
    },
  ];
  const renderButtons = (buttonsToShow: {text: string; onPress(): void}[]) => {
    return (
      <View style={styles.buttons}>
        {buttonsToShow.map(({text, onPress}, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={styles.button}
            onPress={() => {
              RNToast.hide();
              onPress && onPress();
            }}>
            <Text style={styles.buttonText}>{text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={open} style={[styles.toast]}>
      <View style={styles.textContainer}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={styles.text}>{message}</Text>
      </View>
      {renderButtons(buttons || DEFAULT_BUTTONS)}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toast: {
    shadowColor: DARK_BLUE,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.58,
    elevation: 2,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  textContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 10,
    flex: 1,
    width: width - 40,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    paddingHorizontal: 20,
    color: DARK_BLUE,
    fontSize: 16,
    fontWeight: '700',
  },
  text: {
    paddingHorizontal: 20,
    color: DARK_BLUE,
    fontSize: 16,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    paddingVertical: 10,
    color: DARK_BLUE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
