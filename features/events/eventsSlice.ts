import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';
import {eventConverter, EventParticipation, ProjetXEvent} from './eventsTypes';
import {createTransform} from 'redux-persist';
import {removeEventAnswerReminder} from './eventsApi';
import moment from 'moment';
import {getMyId} from '../user/usersApi';

export interface EventReminder {
  onesignalId: string;
  date: moment.Moment;
}
interface EventsState {
  current?: ProjetXEvent;
  list: {
    [uid: string]: ProjetXEvent;
  };
  reminders: {
    [eventId: string]: EventReminder;
  };
}

const initialState: EventsState = {list: {}, reminders: {}};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    editEvent(state, action: PayloadAction<ProjetXEvent>) {
      state.current = action.payload;
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
    createEvent(state) {
      state.current = new ProjetXEvent({id: ''});
    },
    fetchEvents(state, action: PayloadAction<ProjetXEvent[]>) {
      state.list = {};
      for (const event of action.payload) {
        state.list[event.id] = event;
      }
    },
    updateEvent(state, action: PayloadAction<ProjetXEvent>) {
      const event = new ProjetXEvent(action.payload);
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
      const event = state.list[eventId]
        ? new ProjetXEvent(state.list[eventId])
        : undefined;
      if (event) {
        event.participations[userId] = type;
        state.list[eventId] = event;
      }
      if (state.current && state.current.id === eventId) {
        state.current = event;
      }
      if (
        [EventParticipation.going, EventParticipation.notgoing].includes(
          type,
        ) &&
        state.reminders[eventId]
      ) {
        removeEventAnswerReminder(state.reminders[eventId].onesignalId);
        delete state.reminders[eventId];
      }
    },
  },
});

export const {
  editEvent,
  closeEvent,
  createEvent,
  fetchEvents,
  updateEvent,
  eventCanceled,
  participationUpdated,
  remindEvent,
} = eventsSlice.actions;

const sortEvents = (eventA: ProjetXEvent, eventB: ProjetXEvent) => {
  const startingDateA = eventA.getStartingDate();
  const startingDateB = eventB.getStartingDate();
  if (!startingDateB) {
    return 1;
  }
  if (!startingDateA) {
    return -1;
  }
  if (!eventA.isFinished()) {
    if (eventB.isFinished()) {
      return -1;
    }
    return startingDateA.valueOf() - startingDateB.valueOf();
  }
  return startingDateB.valueOf() - startingDateA.valueOf();
};

export const selectMyEvents = (state: RootState): ProjetXEvent[] =>
  Object.values<ProjetXEvent>(state.events.list).sort(sortEvents);
export const selectGroupEvents =
  (groupId: string) =>
  (state: RootState): ProjetXEvent[] =>
    Object.values<ProjetXEvent>(state.events.list)
      .filter(event => event.groups && event.groups[groupId])
      .sort(sortEvents);
export const selectCurrentEvent = (state: RootState) => state.events.current;
export const selectEvent = (eventId: string) => (state: RootState) =>
  state.events.list[eventId];
export const selectReminder =
  (eventId: string | undefined) => (state: RootState) =>
    eventId && state.events.reminders[eventId];
export const selectAmIParticipating =
  (eventId: string) => (state: RootState) => {
    if (!eventId) {
      return false;
    }
    const me = getMyId();
    const event = state.events.list[eventId];
    return (
      event &&
      (event.author === me ||
        event.participations[me] === EventParticipation.going)
    );
  };
export const selectEventsWaitingForAnswers = (
  state: RootState,
): ProjetXEvent[] => {
  return Object.values<ProjetXEvent>(state.events.list)
    .filter(event => {
      return (
        !event.isFinished() &&
        [EventParticipation.maybe, EventParticipation.notanswered].includes(
          event.participations[getMyId()],
        )
      );
    })
    .sort((eventA, eventB) => {
      const answerA = eventA.participations[getMyId()];
      const answerB = eventB.participations[getMyId()];
      if (
        answerA === EventParticipation.maybe &&
        answerB === EventParticipation.notanswered
      ) {
        return -1;
      }
      if (
        answerA === EventParticipation.notanswered &&
        answerB === EventParticipation.maybe
      ) {
        return 1;
      }
      return sortEvents(eventA, eventB);
    });
};
export const selectUpcomingEvents = (state: RootState): ProjetXEvent[] =>
  Object.values<ProjetXEvent>(state.events.list)
    .filter(
      event =>
        !event.isFinished() &&
        [EventParticipation.going].includes(event.participations[getMyId()]),
    )
    .sort(sortEvents);

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
