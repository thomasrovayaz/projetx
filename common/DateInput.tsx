import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import Text from './Text';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';
// @ts-ignore
import DateRangePicker from 'react-native-daterange-picker';
import {DateValue} from '../features/events/eventsTypes';
import Date from './Date';
import {BEIGE, BORDER_COLOR, DARK_BLUE} from '../app/colors';

interface DateDialogState extends DateValue {
  displayedDate?: moment.Moment;
}

interface ProjetXDateInputProps {
  placeholder?: string;
  value?: DateValue;
  onChange(value: DateValue): void;
  range?: boolean;
}

interface Style {
  main: ViewStyle;
  mainText: ViewStyle;
  placeholder: ViewStyle;
  valueText: ViewStyle;
  headerTextStyle: TextStyle;
  dayTextStyle: TextStyle;
  dayHeaderTextStyle: TextStyle;
  buttonTextStyle: TextStyle;
  selectedStyle: ViewStyle;
  selectedTextStyle: TextStyle;
}

const styles = StyleSheet.create<Style>({
  main: {
    width: '100%',
    flexDirection: 'row',
    minHeight: 50,
    borderRadius: 15,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  },
  mainText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
    color: DARK_BLUE,
    flex: 1,
  },
  placeholder: {
    opacity: 0.5,
  },
  valueText: {
    opacity: 1,
  },
  headerTextStyle: {
    fontFamily: 'Montserrat Alternates',
    color: DARK_BLUE,
  },
  dayTextStyle: {
    fontFamily: 'Montserrat Alternates',
    color: DARK_BLUE,
  },
  dayHeaderTextStyle: {
    fontFamily: 'Montserrat Alternates',
    color: DARK_BLUE,
  },
  buttonTextStyle: {
    fontFamily: 'Montserrat Alternates',
    color: DARK_BLUE,
  },
  selectedStyle: {
    backgroundColor: BEIGE,
  },
  selectedTextStyle: {
    color: DARK_BLUE,
  },
});

const DateInput: React.FC<TouchableOpacityProps & ProjetXDateInputProps> = ({
  placeholder,
  value,
  onChange,
  range,
  ...props
}) => {
  const [dialogState, setDialogState] = useState<DateDialogState>({
    displayedDate: moment(),
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    if (!value) {
      setDialogState({
        displayedDate: moment(),
      });
      return;
    }
    setDialogState({
      displayedDate: value.startDate || moment(),
      startDate: value.startDate,
      endDate: value.endDate,
    });
  }, [value]);

  const renderValue = () => {
    const placeholderView = (
      <Text
        style={{
          ...styles.mainText,
          ...styles.placeholder,
        }}>
        {placeholder}
      </Text>
    );
    if (!value) {
      return placeholderView;
    }
    return (
      <Date date={value} onlyDate style={[styles.mainText, styles.valueText]} />
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
        <Icon name="calendar" color={DARK_BLUE} size={24} />
      </TouchableOpacity>
      <DateRangePicker
        open={openDialog}
        minDate={moment()}
        displayedDate={dialogState.displayedDate}
        endDate={dialogState.endDate}
        startDate={dialogState.startDate}
        headerTextStyle={styles.headerTextStyle}
        dayHeaderTextStyle={styles.dayHeaderTextStyle}
        dayTextStyle={styles.dayTextStyle}
        buttonTextStyle={styles.buttonTextStyle}
        selectedStyle={styles.selectedStyle}
        selectedTextStyle={styles.selectedTextStyle}
        onChange={(newDialogState: DateDialogState) => {
          if (!range) {
            if (newDialogState.date) {
              onChange({
                date: newDialogState.date,
              });
              setOpenDialog(false);
            }
          } else if (newDialogState.endDate) {
            onChange({
              startDate: newDialogState.startDate || dialogState.startDate,
              endDate: newDialogState.endDate,
            });
            setOpenDialog(false);
          }
          setDialogState({...dialogState, ...newDialogState});
        }}
        onClose={() => setOpenDialog(false)}
        range={range}>
        <View />
      </DateRangePicker>
    </>
  );
};

export default DateInput;
