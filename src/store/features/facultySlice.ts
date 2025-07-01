import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchFaculty = createAsyncThunk('faculty/fetchFaculty', async () => {
  const response = await api.get('/faculty');
  return response.data;
});

const facultySlice = createSlice({
  name: 'faculty',
  initialState: {
    list: [],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaculty.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFaculty.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchFaculty.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export default facultySlice.reducer; 