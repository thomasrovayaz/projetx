import React from 'react';
import {StyleSheet, Text, ViewStyle} from 'react-native';
import {ProjetXEvent} from '../eventsTypes';
import {translate} from '../../../app/locales';
import Label from '../../../common/Label';
import {useAppSelector} from '../../../app/redux';
import {selectUser} from '../../user/usersSlice';

interface ProjetXEventOwnerProps {
  event: ProjetXEvent;
}

interface Style {
  value: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  value: {
    fontFamily: 'Inter',
    fontSize: 14,
    marginBottom: 20,
  },
});

const EventOwner: React.FC<ProjetXEventOwnerProps> = ({event}) => {
  const author = useAppSelector(selectUser(event.author));
  if (event.isAuthor()) {
    return null;
  }
  return (
    <>
      <Label>{translate('El jefe')}</Label>
      <Text style={styles.value}>{author.name}</Text>
    </>
  );
};

export default EventOwner;
