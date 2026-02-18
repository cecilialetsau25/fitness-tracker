import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  name: string;
  goals: string;
  height: number;
  weight: number;
  calorieGoal: number;
}

const initialState: UserState = {
  name: "Letsau Cecilia",
  goals: "Lose 5kg",
  height: 175,
  weight: 70,
  calorieGoal: 120,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
