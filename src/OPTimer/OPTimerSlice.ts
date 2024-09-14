import { createSlice } from "@reduxjs/toolkit";
import { OPTimer } from "./OPTimerTypes";

const inisital: OPTimer = { Interval: "0" };

const opTimerSlice = createSlice({
  name: "opTimer", 
  initialState: inisital, 
  reducers: {
    loadOPTimerStore(state, action: {payload: OPTimer}) {
      return action.payload;
    }, 
  }
})

export const { 
  loadOPTimerStore
} = opTimerSlice.actions;

export default opTimerSlice.reducer;