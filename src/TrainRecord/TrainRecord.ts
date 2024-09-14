import { TrainRecordActionType } from "./TrainRecordActionType";
import { Location } from "../Util/Location";

export type TrainRecord = {
  actionType: TrainRecordActionType, 
  acted: boolean, 
  signName: string, 
  location: Location
};