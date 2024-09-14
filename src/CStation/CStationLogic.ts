import { TrainRecordList, TrainRecordStore } from "../TrainRecord/TrainRecordSlice";
import { LSpawnListStore } from "../LSpawn/LSpawnSlice";
import { OPTimer } from "../OPTimer/OPTimerTypes";
import { CStationAction } from "./CStationTypes";
import { TimeCalcInInterval } from "../Util/TimeUtil";

type calcTrainEntry = {
  trainName: string, 
  /** まわりがstringなのでstringで保持 */
  scheduleSpawnTime: string
  trainRecord: TrainRecordList
}

export function cStationSimulate(
  cStationName: string, trainRecordStore: TrainRecordStore, lSpawnListStore: LSpawnListStore, opTimer: OPTimer
) {
  // まず、実際に計算が必要な列車の情報を集める
  const trainRecords = collectTrainAtCStation(trainRecordStore, cStationName);

  // 計算に必要な情報を列車に紐づける
  const trainList = calcTrainsFromTrainList(trainRecords, lSpawnListStore);
  
  // 実際の計算をする
  const actionListInCStation = calcActionListInCStation(cStationName, trainList, opTimer);

  // できたはず
  return actionListInCStation
}

export function calcActionListInCStation(
  cStationName: string, calcTrainList: calcTrainEntry[], opTimer: OPTimer
) {
  const actionListInCStation: CStationAction[] = []
  for (const train of calcTrainList) {
    // 実際に計算する列車
    for (const recEntry of train.trainRecord.list) {
      // TrainRecordのエントリ
      const record = recEntry.trainRecord;
      if (record.signName === cStationName) {
        const timeRaw = TimeCalcInInterval(
          train.scheduleSpawnTime, recEntry.recordedAt, opTimer.Interval
        );
        actionListInCStation.push({
          timeAt: timeRaw, 
          action: record.actionType, 
          acted: record.acted, 
          trainName: train.trainName
        })
      }
    }
  }

  return actionListInCStation;
}

/**
 * LSpawnとTrainRecordから実際に存在する列車を計算する
 * @param trainRecords 
 * @param lSpawnListStore 
 * @returns 
 */
export function calcTrainsFromTrainList(
  trainRecords: TrainRecordStore, lSpawnListStore: LSpawnListStore
) {
  const trainList: calcTrainEntry[] = [];
  for (const key of Object.keys(lSpawnListStore)) {
    // LSoawn看板ごと
    const lspnlist = lSpawnListStore[key];
    for (const entry of lspnlist.list) {
      // スポーンする列車ごと
      for (const trainName of Object.keys(trainRecords)) {
        if (entry.spawnTrainName === trainName) {
          trainList.push({
            trainName: trainName, 
            scheduleSpawnTime: entry.scheduleTime, 
            trainRecord: trainRecords[trainName]
          });
        }
      }
    }
  }

  return trainList;
}

/**
 * CStationに関連する列車の名前とTrainRecordを収集する
 * @param trainRecordStore 
 * @param cStationName 
 * @returns 
 */
export function collectTrainAtCStation(
  trainRecordStore: TrainRecordStore, cStationName: string
) {
  
  const trainRecords: TrainRecordStore = {};
  for (const train of Object.keys(trainRecordStore)) {
    // 列車ごと
    const rec = trainRecordStore[train];
    for (const entry of rec.list) {
      console.log(entry);
      // 駅ごと
      if (entry.trainRecord.signName === cStationName) {
        trainRecords[train] = rec;
        break;
      }
    }
  }

  return trainRecords;
}

export function collectCStation(trainRecordStore: TrainRecordStore) {
  const stationNameList: string[] = [];
  for (const key of Object.keys(trainRecordStore)) {
    const recordList = trainRecordStore[key].list
    for (const entry of recordList) {
      const stationName = entry.trainRecord.signName;
      // 被りなくリストに入れる
      if (stationName == null)
        continue;
      if (!stationNameList.includes(stationName))
        stationNameList.push(stationName);
    }
  }
  return stationNameList;
} 