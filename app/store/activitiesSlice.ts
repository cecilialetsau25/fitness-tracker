import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Activity {
  id: string;
  name: string;
  calories: number;
  time: string;
}

interface ActivitiesState {
  list: Activity[];
}

const initialState: ActivitiesState = {
  list: [],
};

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.list.push(action.payload);
    },
    resetActivities: (state) => {
      state.list = [];
    },
  },
});

export const { addActivity, resetActivities } = activitiesSlice.actions;
export default activitiesSlice.reducer;
