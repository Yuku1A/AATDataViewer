import { TrainRecordActionType } from "../TrainRecord/TrainRecordTypes"

export type CStationAction = {
  /** 内部用で使うのみ(Reduxにさえ載らない)のでこれで */
  timeAt: number, 
  action: TrainRecordActionType, 
  acted: boolean, 
  trainName: string
}