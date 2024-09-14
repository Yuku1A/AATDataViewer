import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LSpawn, LSpawnList } from "./LSpawnType";

export type LSpawnListStore = {
  [T: string]: LSpawnList
}

interface LSpawnPayload {
  value: LSpawn[], 
  lSpawnListName: string
}

const inisital: LSpawnListStore = {}

const lSpawnSlice = createSlice({
  name: "lSpawn", 
  initialState: inisital, 
  reducers: {
    loadLSpawnListStore(state, action) {
      return action.payload;
    }, 
    changeLSpawnList: {
      reducer(state, action: PayloadAction<LSpawnPayload>) {
        state[action.payload.lSpawnListName].list = action.payload.value
      }, 
      prepare(lSpawnListName: string, value: LSpawn[]): {payload: LSpawnPayload} {
        return {
          payload: {
            value: value, 
            lSpawnListName: lSpawnListName
          }
        }
      }
    }, 
  }
})

export const { 
  loadLSpawnListStore, 
  changeLSpawnList
} = lSpawnSlice.actions;

export default lSpawnSlice.reducer;