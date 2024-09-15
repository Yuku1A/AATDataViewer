import { TrainRecordEntry } from "../TrainRecord/TrainRecordTypes";
import { TimeCalcInInterval } from "../Util/TimeUtil";

export function simulateTrainFromLSpawn(
  trainRecord: TrainRecordEntry[], spawnTime: string, interval: string
): TrainRecordEntry[] {
  const list: TrainRecordEntry[] = [];
  for (var originalEntry of trainRecord) {
    const entry = structuredClone(originalEntry);
    entry.recordedAt = TimeCalcInInterval(entry.recordedAt, spawnTime, interval).toString();
    list.push(entry);
  }
  return list;
}