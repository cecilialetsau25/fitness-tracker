import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StepsState {
  count: number;
}

const initialState: StepsState = {
  count: 0,
};

const stepsSlice = createSlice({
  name: "steps",
  initialState,
  reducers: {
    setSteps: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    resetSteps: (state) => {
      state.count = 0;
    },
  },
});

export const { setSteps, resetSteps } = stepsSlice.actions;
export default stepsSlice.reducer;
