import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import usersReducer from "./slice/usersSlice";
import toggleTheme from "./slice/themeSilce";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    theme: toggleTheme,
  },
});

export default store;
