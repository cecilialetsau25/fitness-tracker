import { configureStore } from "@reduxjs/toolkit";
import activitiesReducer from "./activitiesSlice";
import profileReducer from "./profileSlice";
import stepsReducer from "./stepsSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    activities: activitiesReducer,
    steps: stepsReducer,
    profile: profileReducer,
    user: userReducer,
  },
});

// Types for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
