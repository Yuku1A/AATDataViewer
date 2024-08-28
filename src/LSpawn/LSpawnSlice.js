import { createSlice } from "@reduxjs/toolkit";

const lSpawnSlice = createSlice({
  name: "lSpawn", 
  initialState: {}, 
  reducers: {
    loadLSpawnListStore(state, action) {
      return action.payload;
    }, 
    changeLSpawnList: {
      reducer(state, action) {
        state[action.payload.trainName].list = action.payload.value
      }, 
      prepare(trainName, value) {
        return {
          payload: {
            value: value, 
            trainName: trainName
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