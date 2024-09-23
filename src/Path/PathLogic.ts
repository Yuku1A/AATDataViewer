import { CalcTrainEntry, calcTrainsFromTrainList, collectTrainAtCStation } from "../CStation/CStationLogic";
import { LSpawnListStore } from "../LSpawn/LSpawnSlice";
import { OPTimer } from "../OPTimer/OPTimerTypes";
import { TrainRecordStore } from "../TrainRecord/TrainRecordSlice";
import { PathAction, PathActionType, PathDirection, PathMutex, PathMutexInfo } from "./PathTypes";
import { TimeCalcInInterval } from "../Util/TimeUtil";

export function generatePathMutex(
  info: PathMutexInfo, trainRecordStore: TrainRecordStore, 
  lSpawnStore: LSpawnListStore, opTimer: OPTimer
): PathMutex {
  const interval = opTimer.Interval;
  const startGateways = info.startGateways;
  const endGateways = info.endGateways;

  const relatedPoints = info.betweenPoints.concat(startGateways, endGateways);

  // 計算が必要なCStationの情報の収集
  const gateways: readonly string[] = info.startGateways.concat(info.endGateways);

  // 計算が必要な列車の情報の収集
  const calcTrainRecords: TrainRecordStore = {};
  for (const cStationName of gateways) {
    Object.assign(calcTrainRecords, collectTrainAtCStation(
      trainRecordStore, cStationName
    ));
  }

  // 実際に存在する列車の情報
  const calcTrains: CalcTrainEntry[] = calcTrainsFromTrainList(
    calcTrainRecords, lSpawnStore
  );

  const actionList: PathAction[] = [];

  // 方向を含めて解析するために
  // 列車自体の情報を持ってきたが
  for (const train of calcTrains) {
    // とりあえず列車ごとに処理してみよう
    const spawnTime = train.lSpawnInfo.info.scheduleTime;

    let direction: PathDirection | undefined = undefined;
    let draftEnterEvent: PathAction | undefined = undefined;

    const trainRecord = train.trainRecord.list
    for (let i = 0 ; i < trainRecord.length ; i++) {
      const event = train.trainRecord.list[i];
      const nowStation = event.trainRecord.signName;
      if (nowStation === null)
        continue;

      const generatePathAction = (
        direction: PathDirection, action: PathActionType
      ): PathAction => {
        return {
          timeAt: TimeCalcInInterval(spawnTime, event.recordedAt, interval), 
          gatewayName: nowStation, 
          trainName: train.trainName, 
          direction: direction, 
          lSpawnInfo: train.lSpawnInfo, 
          action: action
        }
      }

      // 一般的には両端が交換可能であるなどする場合こっち
      if (startGateways.includes(nowStation) || endGateways.includes(nowStation)) {
        if (direction === undefined) {
          // enter
          if (event.trainRecord.actionType === "cstation_enter") {
            // 境界の駅に入線しただけ
            continue;
          }

          if (startGateways.includes(nowStation)) {
            // start -> end
            // 片方から入ってその後反対側までいかずに折り返す列車を想定して先読み
            for (const checking of trainRecord.slice(i + 1)) {
              const signName = checking.trainRecord.signName;

              if (signName === null) 
                continue;
              if (!relatedPoints.includes(signName)) {
                // このPathMutexとは無関係なところに入った
                break;
              }

              if (endGateways.includes(signName)) {
                // endまでたどり着いた場合
                direction = "end";
                break;
              }
              if (startGateways.includes(signName)) {
                // endにたどり着く前にstartに来た場合
                direction = "start_return";
                break;
              }
            }
          } else if (endGateways.includes(nowStation)) {
            // end -> start
            // 片方から入ってその後反対側までいかずに折り返す列車を想定して先読み
            for (const checking of trainRecord.slice(i + 1)) {
              const signName = checking.trainRecord.signName;
              if (signName === null) 
                continue;
              if (!relatedPoints.includes(signName)) {
                // このPathMutexとは無関係なところに入った
                break;
              }

              if (startGateways.includes(signName)) {
                // startまでたどり着いた場合
                direction = "start";
                break;
              }
              if (endGateways.includes(signName)) {
                // startにたどり着く前にendに来た場合
                direction = "end_return";
                break;
              }
            }
          }

          if (direction !== undefined) {
            draftEnterEvent = generatePathAction(direction, "path_enter");
          }
          
          continue;
        }

        // leave
        if (direction === "start" || direction === "start_return") {
          // startを目指す
          if (!startGateways.includes(nowStation)) {
            // 終点ではない
            continue;
          }
          // 終点にたどり着いた
        }

        if (direction === "end" || direction === "end_return") {
          // endを目指す
          if (!endGateways.includes(nowStation)) {
            // 終点ではない
            continue;
          }
          // 終点にたどり着いた
        }

        // 終点にたどり着いた
        if (draftEnterEvent !== undefined) {
          actionList.push(draftEnterEvent);
          actionList.push(generatePathAction(direction, "path_leave"));
        }
        direction = undefined;
        draftEnterEvent = undefined;
        continue;
      }
    }
  }

  actionList.sort((a, b) => {
    return a.timeAt - b.timeAt;
  });

  // たぶん終わり
  return {
    ...info, 
    actionsList: actionList
  }
}