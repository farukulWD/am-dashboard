import { configureStore } from "@reduxjs/toolkit";
import studentReducer from "./features/studentSlice";
import courseReducer from "./features/courseSlice";
import facultyReducer from "./features/facultySlice";
import dashboardReducer from "./features/dashboardSlice";
import reportReducer from "./features/reportSlice";
import sideBarReducer from "./features/sideBarSlice";
import gradesReducer from "./features/gradesSlice";

export const store = configureStore({
  reducer: {
    students: studentReducer,
    courses: courseReducer,
    faculty: facultyReducer,
    dashboard: dashboardReducer,
    reports: reportReducer,
    sidebar: sideBarReducer,
    grades: gradesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
