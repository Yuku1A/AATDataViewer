import { Location } from "../Util/Location";

export type TrainRecordActionType = "spawn" | "cstation_leave" | "cstation_enter";

export type TrainRecordInfo = {
  actionType: TrainRecordActionType, 
  acted: boolean, 
  signName: string | null, 
  location: Location
};

export type TrainRecordEntry = {
  /** stringでdumpされるのでstringで保持 */
  recordedAt: string, 
  trainRecord: TrainRecordInfo
};