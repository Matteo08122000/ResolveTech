import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logs: [],
  loading: false,
  error: null,
};

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setLogs(state, action) {
      state.logs = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addLog(state, action) {
      state.logs.push(action.payload);
    },
    removeLog(state, action) {
      state.logs = state.logs.filter(log => log._id !== action.payload);
    },
  },
});

export const { setLogs, setLoading, setError, addLog, removeLog } = logsSlice.actions;

export default logsSlice.reducer;