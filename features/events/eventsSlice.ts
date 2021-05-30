import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';
import {EventParticipation, ProjetXEvent} from './eventsTypes';
import {Navigation} from 'react-native-navigation';

interface EventsState {
  current?: ProjetXEvent;
  list: {
    [uid: string]: ProjetXEvent;
  };
}

const initialState: EventsState = {list: {}};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    openEvent(
      state,
      action: PayloadAction<{event: ProjetXEvent; componentId: string}>,
    ) {
      state.current = action.payload.event;
      Navigation.push(action.payload.componentId, {
        component: {
          name: 'Event',
        },
      });
    },
    editEvent(
      state,
      action: PayloadAction<{event: ProjetXEvent; componentId: string}>,
    ) {
      state.current = action.payload.event;
      Navigation.push(action.payload.componentId, {
        component: {
          name: 'CreateEventType',
        },
      });
    },
    closeEvent(state) {
      state.current = undefined;
    },
    createEvent(state, action: PayloadAction<string>) {
      state.current = new ProjetXEvent('');
      Navigation.push(action.payload, {
        component: {
          name: 'CreateEventType',
        },
      });
    },
    fetchEvents(state, action: PayloadAction<ProjetXEvent[]>) {
      state.list = {};
      for (const event of action.payload) {
        state.list[event.id] = event;
      }
    },
    updateEvent(state, action: PayloadAction<ProjetXEvent>) {
      const event = action.payload;
      if (state.current && state.current.id === event.id) {
        state.current = event;
      }
      state.list[event.id] = event;
    },
    participationUpdated(
      state,
      action: PayloadAction<{
        eventId: string;
        userId: string;
        type: EventParticipation;
      }>,
    ) {
      const {eventId, userId, type} = action.payload;
      if (state.current && state.current.id === eventId) {
        state.current.participations[userId] = type;
      }
      const event = state.list[eventId];
      if (event) {
        event.participations[userId] = type;
      }
    },
  },
});

export const {
  openEvent,
  editEvent,
  closeEvent,
  createEvent,
  fetchEvents,
  updateEvent,
  participationUpdated,
} = eventsSlice.actions;

export const selectMyEvents = (state: RootState): ProjetXEvent[] =>
  Object.values(state.events.list);
export const selectCurrentEvent = (state: RootState) => state.events.current;

export default eventsSlice.reducer;
