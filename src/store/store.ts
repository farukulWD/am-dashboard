import { configureStore } from '@reduxjs/toolkit';

// Import your reducers here when you create them
// import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    // user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 