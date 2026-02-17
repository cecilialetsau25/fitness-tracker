import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  name: string;
  goals: string;
  height: number;
  weight: number;
}

const initialState: ProfileState = {
  name: "John Doe",
  goals: "Lose 5kg",
  height: 175,
  weight: 70,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
