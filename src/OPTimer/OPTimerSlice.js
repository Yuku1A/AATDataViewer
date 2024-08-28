import { createSlice } from "@reduxjs/toolkit";

const opTimerSlice = createSlice({
  name: "opTimer", 
  initialState: {}, 
  reducers: {
    loadOPTimerStore(state, action) {
      return action.payload;
    }, 
  }
})

export const { 
  loadOPTimerStore
} = opTimerSlice.actions;

export default opTimerSlice.reducer;