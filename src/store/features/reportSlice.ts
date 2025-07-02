import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../helper/axios';
import { IEnrollmentReport, ITopStudentReport } from '../types';

type TReportData = IEnrollmentReport[] | ITopStudentReport[];

export const fetchReports = createAsyncThunk<TReportData>('reports/fetchReports', async () => {
  const response = await api.get('/reports');
  return response.data;
});

interface ReportState {
  data: TReportData;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ReportState = {
  data: [],
  status: 'idle',
  error: null,
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export default reportSlice.reducer; 