import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../helper/axios';
import { IStudent } from '../types';

export const fetchStudents = createAsyncThunk<IStudent[]>('students/fetchStudents', async () => {
  const response = await api.get('/students');
  return response.data;
});

export const fetchStudentById = createAsyncThunk<IStudent, string>('students/fetchStudentById', async (studentId) => {
  const response = await api.get(`/students/${studentId}`);
  return response.data;
});

interface StudentState {
  list: IStudent[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  student: IStudent | null;
}

const initialState: StudentState = {
  list: [],
  status: 'idle',
  error: null,
  student: null,
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudent: (state, action) => {
      state.student = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(fetchStudentById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.student = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export default studentSlice.reducer; 