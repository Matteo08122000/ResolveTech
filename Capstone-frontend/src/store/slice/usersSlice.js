import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addUser(state, action) {
      state.users.push(action.payload);
    },
    removeUser(state, action) {
      state.users = state.users.filter(user => user._id !== action.payload);
    },
    updateUser(state, action) {
      const index = state.users.findIndex(user => user._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
  },
});

export const { setUsers, setLoading, setError, addUser, removeUser, updateUser } = usersSlice.actions;

export default usersSlice.reducer;
