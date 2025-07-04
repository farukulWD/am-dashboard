import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../helper/axios';

export interface IGrade {
  id: string;
  studentId: string;
  courseId: string;
  midterm: number;
  final: number;
  assignments: number;
  overall: string;
}

export const fetchGrades = createAsyncThunk<IGrade[]>('grades/fetchGrades', async () => {
  const response = await api.get('/grades');
  return response.data;
});

export const updateGrade = createAsyncThunk<IGrade, Partial<IGrade>>('grades/updateGrade', async (grade) => {
  const response = await api.put(`/grades/${grade.id}`, grade);
  return response.data;
});

interface GradesState {
  list: IGrade[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: GradesState = {
  list: [],
  status: 'idle',
  error: null,
};

const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGrades.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchGrades.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(updateGrade.fulfilled, (state, action) => {
        const idx = state.list.findIndex(g => g.id === action.payload.id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
      });
  },
});

export default gradesSlice.reducer; 