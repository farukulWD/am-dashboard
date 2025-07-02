import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../helper/axios';
import { IDashboardSummary } from '../types';

export const fetchDashboard = createAsyncThunk<IDashboardSummary>('dashboard/fetchDashboard', async () => {
  const response = await api.get('/dashboard');
  return response.data;
});

interface DashboardState {
  summary: IDashboardSummary | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  status: 'idle',
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
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