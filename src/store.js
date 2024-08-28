import { configureStore } from "@reduxjs/toolkit";
import trainRecordReducer from "./TrainRecord/TrainRecordSlice"
import lSpawnListReducer from "./LSpawn/LSpawnSlice";
import opTimerReducer from "./OPTimer/OPTimerSlice"

export default configureStore({
  reducer: {
    trainRecordStore: trainRecordReducer, 
    lSpawnListStore: lSpawnListReducer, 
    opTimer: opTimerReducer
  }
})