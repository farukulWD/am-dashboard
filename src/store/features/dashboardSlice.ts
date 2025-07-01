import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchDashboard = createAsyncThunk('dashboard/fetchDashboard', async () => {
  const response = await api.get('/dashboard');
  return response.data;
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: {},
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export default dashboardSlice.reducer; 