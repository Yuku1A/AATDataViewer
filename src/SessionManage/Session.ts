import { LSpawnListStore } from "../LSpawn/LSpawnSlice";
import { OPTimer } from "../OPTimer/OPTimerTypes";
import { PathMutexInfoStore } from "../Path/PathSlice";
import { TrainRecordStore } from "../TrainRecord/TrainRecordSlice";

export default class Session{
  constructor(
    public readonly sessionName: string, 
    public readonly trainRecord: TrainRecordStore, 
    public readonly opTimer: OPTimer, 
    public readonly lSpawnList: LSpawnListStore, 
    public readonly pathMutexInfoStore: PathMutexInfoStore
  ) { }

  static isThis(value: unknown): value is Session {
    const value2 = value as Record<keyof Session, unknown>;
    if (typeof value2.sessionName !== "string")
      return false;
    if (typeof value2.lSpawnList !== "object")
      return false;
    if (typeof value2.opTimer !== "object")
      return false;
    if (typeof value2.trainRecord !== "object")
      return false;
    return true;
  }
}