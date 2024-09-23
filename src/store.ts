import { configureStore } from "@reduxjs/toolkit";
import trainRecordReducer from "./TrainRecord/TrainRecordSlice"
import lSpawnListReducer from "./LSpawn/LSpawnSlice";
import opTimerReducer from "./OPTimer/OPTimerSlice"
import sessionNameReducer from "./SessionManage/SessionNameSlice";
import PathSlice from "./Path/PathSlice";

export const store = configureStore({
  reducer: {
    trainRecordStore: trainRecordReducer, 
    lSpawnListStore: lSpawnListReducer, 
    opTimer: opTimerReducer, 
    sessionName: sessionNameReducer, 
    pathMutexInfoStore: PathSlice
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;