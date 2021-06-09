import {combineReducers, configureStore} from '@reduxjs/toolkit';
import chatsSlice from '../features/chat/chatsSlice';
import groupsSlice from '../features/groups/groupsSlice';
import eventsSlice, {eventsTransform} from '../features/events/eventsSlice';
import pollsSlice, {pollsTransform} from '../features/polls/pollsSlice';
import usersSlice from '../features/user/usersSlice';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  transforms: [eventsTransform, pollsTransform],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    chats: chatsSlice,
    events: eventsSlice,
    groups: groupsSlice,
    polls: pollsSlice,
    users: usersSlice,
  }),
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
