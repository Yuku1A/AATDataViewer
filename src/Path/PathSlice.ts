import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PathMutexInfo } from "./PathTypes"

export type PathMutexInfoStore = {
  [K: string]: PathMutexInfo;
}

export type PathPayload = {
  value: PathMutexInfo;
  id: string;
}

const initial: PathMutexInfoStore = {}

const pathSlice = createSlice({
  name: "PathMutexInfo", 
  initialState: initial, 
  reducers: {
    loadPathMutexInfo(_, action: PayloadAction<PathMutexInfoStore>) {
      return action.payload;
    }, 
    changePathMutexInfo(state, action: PayloadAction<PathMutexInfo>) {
      state[action.payload.id] = action.payload;
    }, 
    deletePathMutexInfo(state, action: PayloadAction<string>) {
      delete state[action.payload];
    }
  }
})

export const {
  loadPathMutexInfo, 
  changePathMutexInfo, 
  deletePathMutexInfo
} = pathSlice.actions;

export default pathSlice.reducer;