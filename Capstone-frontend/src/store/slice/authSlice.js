import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  redirecting: false,
  isAuthenticated: !!localStorage.getItem("token"),
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      const { id, name, email, role, token } = action.payload; 
      state.user = { id, name, email, role }; 
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
      localStorage.setItem(
        "user",
        JSON.stringify({ id, name, email, role }) 
      );
      localStorage.setItem("token", token);
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },

    setRedirecting(state, action) {
      state.redirecting = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    resetError(state) {
      state.error = null;
    },

    initializeAuth(state) {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (token && user) {
        state.user = user;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
  },
});

export const {
  setUser,
  setLoading,
  setRedirecting,
  setError,
  logout,
  resetError,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
