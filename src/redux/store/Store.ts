import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import AppDataReducer from "../reducers/AppDataReducer";
import UserDataReducer from "../reducers/UserDataReducer";

export const store = configureStore({
  reducer: {
    app_data: AppDataReducer,
    user_data: UserDataReducer,
  },
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
