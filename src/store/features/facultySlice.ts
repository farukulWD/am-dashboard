import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../helper/axios';
import { IFaculty } from '../types';

export const fetchFaculty = createAsyncThunk<IFaculty[]>('faculty/fetchFaculty', async () => {
  const response = await api.get('/faculty');
  return response.data;
});

interface FacultyState {
  list: IFaculty[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FacultyState = {
  list: [],
  status: 'idle',
  error: null,
};

const facultySlice = createSlice({
  name: 'faculty',
  initialState,
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