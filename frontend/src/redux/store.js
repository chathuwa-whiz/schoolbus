import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userApi } from './features/userSlice';
import { childApi } from './features/childSlice';
import { routeApi } from './features/routeSlice';
import authReducer from './features/authSlice';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [childApi.reducerPath]: childApi.reducer,
    [routeApi.reducerPath]: routeApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
        .concat(userApi.middleware)
        .concat(childApi.middleware)
        .concat(routeApi.middleware),
});

setupListeners(store.dispatch);