import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';
import {eventConverter, EventParticipation, ProjetXEvent} from './eventsTypes';
import {Navigation} from 'react-native-navigation';
import {createTransform} from 'redux-persist';
import {removeEventAnswerReminder} from './eventsApi';
import moment from 'moment';

interface EventsState {
  current?: ProjetXEvent;
  list: {
    [uid: string]: ProjetXEvent;
  };
  reminders: {
    [eventId: string]: {onesignalId: string; date: moment.Moment};
  };
}

const initialState: EventsState = {list: {}, reminders: {}};

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
    remindEvent(
      state,
      {
        payload: {event, onesignalId, date},
      }: PayloadAction<{
        event: ProjetXEvent;
        onesignalId: string;
        date: moment.Moment;
      }>,
    ) {
      state.reminders[event.id] = {onesignalId, date};
    },
    createEvent(state, action: PayloadAction<string>) {
      state.current = new ProjetXEvent({id: ''});
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
    eventCanceled(state, action: PayloadAction<ProjetXEvent>) {
      const event = action.payload;
      if (state.current && state.current.id === event.id) {
        delete state.current;
      }
      delete state.list[event.id];
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
      if (
        [EventParticipation.going, EventParticipation.notgoing].includes(
          type,
        ) &&
        state.reminders[event.id]
      ) {
        removeEventAnswerReminder(state.reminders[event.id].onesignalId);
        delete state.reminders[event.id];
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
  eventCanceled,
  participationUpdated,
  remindEvent,
} = eventsSlice.actions;

export const selectMyEvents = (state: RootState): ProjetXEvent[] =>
  Object.values<ProjetXEvent>(state.events.list).sort((eventA, eventB) => {
    const startingDateA = eventA.getStartingDate();
    const startingDateB = eventB.getStartingDate();
    if (!startingDateB) {
      return 1;
    }
    if (!startingDateA) {
      return -1;
    }
    return startingDateB.valueOf() - startingDateA.valueOf();
  });
export const selectCurrentEvent = (state: RootState) => state.events.current;
export const selectReminder = (eventId: string) => (state: RootState) =>
  state.events.reminders[eventId];

export default eventsSlice.reducer;

export const eventsTransform = createTransform(
  null,
  (outboundState: any) => {
    const events: {[id: string]: ProjetXEvent} = {};
    if (outboundState.list) {
      for (const eventId in outboundState.list) {
        if (outboundState.list.hasOwnProperty(eventId)) {
          events[eventId] = eventConverter.fromLocalStorage(
            outboundState.list[eventId],
          );
        }
      }
    }
    return {
      list: events,
      current: outboundState.current
        ? eventConverter.fromLocalStorage(outboundState.current)
        : null,
      reminders: outboundState.reminders || {},
    };
  },
  {whitelist: ['events']},
);
