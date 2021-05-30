import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';

interface EventsState {
  value: number;
}

const initialState: EventsState = {
  value: 0,
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
});

export const {} = eventsSlice.actions;

export const selectCount = (state: RootState) => state.events.value;

export default eventsSlice.reducer;
