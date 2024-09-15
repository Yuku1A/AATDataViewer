import { TrainRecordList, TrainRecordStore } from "../TrainRecord/TrainRecordSlice";
import { LSpawnListStore } from "../LSpawn/LSpawnSlice";
import { OPTimer } from "../OPTimer/OPTimerTypes";
import { CStationAction } from "./CStationTypes";
import { TimeCalcInInterval } from "../Util/TimeUtil";
import { LSpawnInfo } from "../LSpawn/LSpawnType";

export type CalcTrainEntry = {
  trainName: string;
  lSpawnInfo: LSpawnInfo;
  trainRecord: TrainRecordList;
}

/**
 * 
 * @param cstation ソートされた状態で投入してください
 * @returns { number[] } 支障のある列車のイベント時刻
 */
export function overlapCheck(cstation: CStationAction[]): number[] {
  const result: number[] = [];
  let occupyTrain: number = 0;
  let event: CStationAction;
  let lastCheck: boolean = false;
  for (let i = 0 ; i < cstation.length ; i++) {
    event = cstation[i];
    const action = event.action;
    const acted = event.acted

    // leaveから始まった場合最後尾から開始
    if (i === 0 && action === "cstation_leave") {
      lastCheck = true;
      i = cstation.length - 2;
      continue;
    }
    if (lastCheck) {
      lastCheck = false;
      i = -1;
    }

    // 通常の検査ルーチン
    if (action === "cstation_enter" && occupyTrain === 0) {
      // 普通に入線する
      occupyTrain++;
      continue;
    }
    if (action === "cstation_leave" && occupyTrain === 1 && acted) {
      // 普通に発車
      occupyTrain--;
      continue;
    }
    if (action === "cstation_leave" && occupyTrain === 0 && !acted) {
      // 普通に通過
      continue;
    }
    // ここに来る場合は実際に動かすと衝突などするパターンになる
    result.push(event.timeAt);
  }
  return result;
}

export function sortCStationActions(cStationActions: CStationAction[]) {
  return cStationActions.sort((a, b) => {
    return a.timeAt - b.timeAt;
  });
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
  cStationName: string, calcTrainList: CalcTrainEntry[], opTimer: OPTimer
) {
  const actionListInCStation: CStationAction[] = []
  for (const train of calcTrainList) {
    // 実際に計算する列車
    for (const recEntry of train.trainRecord.list) {
      // TrainRecordのエントリ
      const record = recEntry.trainRecord;
      if (record.signName === cStationName) {
        const timeRaw = TimeCalcInInterval(
          train.lSpawnInfo.info.scheduleTime, recEntry.recordedAt, opTimer.Interval
        );
        actionListInCStation.push({
          timeAt: timeRaw, 
          action: record.actionType, 
          acted: record.acted, 
          trainName: train.trainName, 
          lSpawnInfo: train.lSpawnInfo
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
  const trainList: CalcTrainEntry[] = [];
  for (const lSpawnSignName of Object.keys(lSpawnListStore)) {
    // LSoawn看板ごと
    const lspnlist = lSpawnListStore[lSpawnSignName];
    for (const entry of lspnlist.list) {
      // スポーンする列車ごと
      for (const trainName of Object.keys(trainRecords)) {
        if (entry.spawnTrainName === trainName) {
          trainList.push({
            trainName: trainName, 
            trainRecord: trainRecords[trainName], 
            lSpawnInfo: {
              info: entry, 
              signName: lSpawnSignName
            }
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