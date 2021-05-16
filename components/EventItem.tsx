import {Event} from '../api/Events';
import Button from './Button';
import React from 'react';
import {GestureResponderEvent} from 'react-native';

interface EventItemProps {
  event: Event;
  onPress(event: GestureResponderEvent): void;
}

const EventItem: React.FC<EventItemProps> = ({event, onPress}) => {
  return <Button variant="outlined" title={event.title} onPress={onPress} />;
};

export default EventItem;
