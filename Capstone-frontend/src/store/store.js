import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import logsReducer from "./slice/logSlice";
import usersReducer from "./slice/usersSlice";
import toggleTheme from "./slice/themeSilce";



const store = configureStore({
  reducer: {
    auth: authReducer,
    logs: logsReducer,
    users: usersReducer,
    theme: toggleTheme

  },
});

export default store;
