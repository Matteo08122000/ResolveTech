import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: [],
  loading: false,
  error: null,
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setTickets(state, action) {
      state.tickets = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addTicket(state, action) {
      state.tickets.push(action.payload);
    },
    removeTicket(state, action) {
      state.tickets = state.tickets.filter(ticket => ticket._id !== action.payload);
    },
    updateTicket(state, action) {
      const index = state.tickets.findIndex(ticket => ticket._id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
    },
  },
});

export const { setTickets, setLoading, setError, addTicket, removeTicket, updateTicket } = ticketsSlice.actions;

export default ticketsSlice.reducer;