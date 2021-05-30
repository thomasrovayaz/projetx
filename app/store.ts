import {configureStore} from '@reduxjs/toolkit';
import eventsSlice from '../features/events/eventsSlice';
import usersSlice from '../features/user/usersSlice';

export const store = configureStore({
  reducer: {
    events: eventsSlice,
    users: usersSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
