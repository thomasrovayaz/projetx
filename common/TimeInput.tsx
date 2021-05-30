import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  Text,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {translate} from '../app/locales';

interface ProjetXDateInputProps {
  placeholder?: string;
  value?: moment.Moment;
  onChange(value: moment.Moment): void;
}

interface Style {
  main: ViewStyle;
  mainText: ViewStyle;
  placeholder: ViewStyle;
  valueText: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  main: {
    width: '100%',
    flexDirection: 'row',
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(71,59,120,0.05)',
    borderColor: '#473B78',
    borderWidth: 1,
  },
  mainText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Inter',
    color: '#473B78',
  },
  placeholder: {
    opacity: 0.5,
  },
  valueText: {
    opacity: 1,
  },
});

const TimeInput: React.FC<TouchableOpacityProps & ProjetXDateInputProps> = ({
  placeholder,
  value,
  onChange,
  ...props
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleConfirm = (date: Date) => {
    onChange(date && moment(date));
    setOpenDialog(false);
  };

  const renderValue = () => {
    if (!value) {
      return (
        <Text
          style={{
            ...styles.mainText,
            ...styles.placeholder,
          }}>
          {placeholder}
        </Text>
      );
    }

    return (
      <Text
        style={{
          ...styles.mainText,
          ...styles.valueText,
        }}>
        {value.format('HH:mm')}
      </Text>
    );
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpenDialog(true)}
        style={{
          ...styles.main,
          // @ts-ignore
          ...props.style,
        }}>
        {renderValue()}
        <Icon name="clock" color={'#473B78'} size={24} />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={openDialog}
        mode="time"
        date={value?.toDate()}
        onConfirm={handleConfirm}
        onCancel={() => setOpenDialog(false)}
        confirmTextIOS={translate('Confirmer')}
        cancelTextIOS={translate('Annuler')}
        headerTextIOS={translate('Choisir une heure')}
      />
    </>
  );
};

export default TimeInput;
