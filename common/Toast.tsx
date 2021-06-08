import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import React, {useEffect} from 'react';
import {translate} from '../app/locales';

interface ProjetXToastProps {
  componentId: string;
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
}) =>
  Navigation.showOverlay({
    component: {
      name: 'Toast',
      passProps: props,
    },
  });

const Toast: NavigationFunctionComponent<ProjetXToastProps> = ({
  componentId,
  message,
  title,
  timeout = 5000,
  onOpen,
  onClose,
  buttons,
}) => {
  const open = () => {
    onOpen && onOpen();
    Navigation.dismissOverlay(componentId);
  };
  const dimiss = (hasClick: boolean) => {
    onClose && onClose(hasClick);
    Navigation.dismissOverlay(componentId);
  };
  useEffect(() => {
    if (timeout) {
      setTimeout(dimiss, timeout);
    }
  }, []);

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
              Navigation.dismissOverlay(componentId);
              onPress && onPress();
            }}>
            <Text style={styles.buttonText}>{text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={open}
      style={[styles.toast, styles.longToast]}>
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
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  longToast: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  textContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#fafafa',
    paddingVertical: 10,
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    paddingHorizontal: 20,
    color: 'black',
    fontSize: 16,
    fontWeight: '700',
  },
  text: {
    paddingHorizontal: 20,
    color: 'black',
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
    paddingTop: 5,
    paddingBottom: 10,
    color: '#E6941B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

Toast.options = {
  layout: {
    componentBackgroundColor: 'transparent',
  },
  overlay: {
    interceptTouchOutside: false,
  },
};

export default Toast;
