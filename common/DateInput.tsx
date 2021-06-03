import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';
// @ts-ignore
import DateRangePicker from 'react-native-daterange-picker';
import {DateValue} from '../features/events/eventsTypes';
import Date from './Date';

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
  selectedStyle: ViewStyle;
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
    textAlign: 'left',
    fontFamily: 'Inter',
    color: '#473B78',
    flex: 1,
  },
  placeholder: {
    opacity: 0.5,
  },
  valueText: {
    opacity: 1,
  },
  selectedStyle: {
    backgroundColor: '#E6941B',
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
    return <Date date={value} style={[styles.mainText, styles.valueText]} />;
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
        <Icon name="calendar" color={'#473B78'} size={24} />
      </TouchableOpacity>
      <DateRangePicker
        open={openDialog}
        minDate={moment()}
        displayedDate={dialogState.displayedDate}
        endDate={dialogState.endDate}
        startDate={dialogState.startDate}
        selectedStyle={styles.selectedStyle}
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
        range={range}
      />
    </>
  );
};

export default DateInput;
