import { TrainRecord } from "./TrainRecord";

export type TrainRecordEntry = {
  /** stringでdumpされるのでstringで保持 */
  recordedAt: string, 
  trainRecord: TrainRecord
}