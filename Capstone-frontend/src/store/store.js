import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import ticketsReducer from "./slice/ticketSlice";
import logsReducer from "./slice/logSlice";
import usersReducer from "./slice/usersSlice";
import toggleTheme from "./slice/themeSilce";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketsReducer,
    logs: logsReducer,
    users: usersReducer,
    toggleTheme: toggleTheme,
  },
});

export default store;
