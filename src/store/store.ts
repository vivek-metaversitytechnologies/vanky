import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import createWebStorage from 'redux-persist/es/storage/createWebStorage';
import auth from "./reducers/auth";
import message from "./reducers/message";
import matches from "./reducers/matches";
import balance from "./reducers/balance";
import accountStatement from "./reducers/accountStatement";

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: string) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('session')
    : createNoopStorage();

const rootReducer = combineReducers({
  auth,
  message,
  matches,
  balance,
  accountStatement,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;

export default store;
export const persistor = persistStore(store);
