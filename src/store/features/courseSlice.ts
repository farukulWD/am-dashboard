import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../helper/axios';
import { ICourse } from '../types';

export const fetchCourses = createAsyncThunk<ICourse[]>('courses/fetchCourses', async () => {
  const response = await api.get('/courses');
  return response.data;
});

interface CourseState {
  list: ICourse[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CourseState = {
  list: [],
  status: 'idle',
  error: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export default courseSlice.reducer; 