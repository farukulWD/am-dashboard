import { createSlice } from "@reduxjs/toolkit";
type initialStateType = {
  isExpanded: boolean;
  isMobileOpen: boolean;
};
const initialState: initialStateType = {
  isExpanded: true,
  isMobileOpen: false,
};

const sideBarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileOpen = !state.isMobileOpen;
    },
    closeMobileSidebar: (state) => {
      state.isMobileOpen = false;
    },
  },
});

export const { toggleMobileSidebar, closeMobileSidebar, toggleSidebar } =
  sideBarSlice.actions;
export default sideBarSlice.reducer;
