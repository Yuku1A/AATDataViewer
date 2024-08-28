import { createSlice } from "@reduxjs/toolkit";

const trainRecordSlice = createSlice({
  name: "trainRecord", 
  initialState: {}, 
  reducers: {
    loadTrainRecordStore(state, action) {
      return action.payload;
    }, 
    changeTrainRecord: {
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
    addTrainRecord: {
      reducer(state, action) {
        state[action.payload.trainName] = action.payload.value
      }, 
      prepare(trainName, value) {
        return {
          payload: {
            value: value, 
            trainName: trainName
          }
        }
      }
    }
  }
})

export const { 
  loadTrainRecordStore, 
  changeTrainRecord, 
  addTrainRecord
} = trainRecordSlice.actions;

export default trainRecordSlice.reducer;