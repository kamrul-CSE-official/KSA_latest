import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import rootApi from "./api";

export const store = configureStore({
  reducer: {
    user: userReducer,

    [rootApi.reducerPath]: rootApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rootApi.middleware),
  devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
