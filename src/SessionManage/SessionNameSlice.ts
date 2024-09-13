import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const sessionNameSlice = createSlice({
  name: "sessionName", 
  initialState: "untitled", 
  reducers: {
    changeSessionName(state, action: PayloadAction<string>) {
      return action.payload;
    }
  }
})

export const {
  changeSessionName
} = sessionNameSlice.actions;

export default sessionNameSlice.reducer;