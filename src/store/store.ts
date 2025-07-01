import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './features/studentSlice';
import courseReducer from './features/courseSlice';
import facultyReducer from './features/facultySlice';
import dashboardReducer from './features/dashboardSlice';
import reportReducer from './features/reportSlice';

// Import your reducers here when you create them
// import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    students: studentReducer,
    courses: courseReducer,
    faculty: facultyReducer,
    dashboard: dashboardReducer,
    reports: reportReducer,
    // user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 