import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TrainRecordEntry } from "./TrainRecordEntry";

export interface TrainRecordStore {
  [T: string]: {
    list: TrainRecordEntry[]
  }
}

interface TrainRecordPayload {
  value: TrainRecordEntry[], 
  trainName: string
}

const initialState: TrainRecordStore = { };

const trainRecordSlice = createSlice({
  name: "trainRecord", 
  initialState: initialState, 
  reducers: {
    // このloadはdumpされたymlの"trainrecord"まるごとを引数にとる、他も同様
    loadTrainRecordStore(state, action: {payload: TrainRecordStore}) {
      return action.payload;
    }, 
    changeTrainRecord: {
      reducer(state, action: PayloadAction<TrainRecordPayload>) {
        state[action.payload.trainName].list = action.payload.value
      }, 
      prepare(trainName: string, value: TrainRecordEntry[]) {
        return {
          payload: {
            value: value, 
            trainName: trainName
          }
        }
      }
    }, 
    addTrainRecord: {
      reducer(state, action: PayloadAction<TrainRecordPayload>) {
        state[action.payload.trainName] = {
          list: action.payload.value
        }
      }, 
      prepare(trainName: string, value: TrainRecordEntry[]) {
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