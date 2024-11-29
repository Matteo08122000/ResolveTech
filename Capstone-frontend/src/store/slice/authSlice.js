import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setUser(state, action) {
        state.user = action.payload;
        state.isAuthenticated = true;
      },
      setLoading(state, action) {
        state.loading = action.payload;
      },
      setError(state, action) {
        state.error = action.payload;
      },
      logout(state) {
        state.user = null;
        state.isAuthenticated = false;
      },
    },
  });
  
  export const { setUser, setLoading, setError, logout } = authSlice.actions;
  
  export default authSlice.reducer;
