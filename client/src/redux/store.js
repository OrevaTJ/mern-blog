
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './user/userSlice';
import themeReducer from './theme/themeSlice';

// Combine reducers into a root reducer
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

// Create a persistor object
export const persistor = persistStore(store);