import { LSpawnInfo } from "../LSpawn/LSpawnType"
import { TrainRecordActionType } from "../TrainRecord/TrainRecordTypes"

export type CStationAction = {
  /** 内部用で使うのみ(Reduxにさえ載らない)のでこれで */
  readonly timeAt: number;
  readonly action: TrainRecordActionType;
  readonly acted: boolean;
  readonly trainName: string;
  readonly lSpawnInfo: LSpawnInfo
  readonly cStationName: string;
}