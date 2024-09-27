import { CStationAction } from "./CStationTypes";

/**
 * 
 * @param cstation ソートされた状態で投入してください
 * @param opTimerInterval OPTimerのinterval
 * @param minimalIntervalInTrains 列車間の最小間隔(ミリ秒単位)
 * @returns 支障のある列車のイベント情報
 */
export function checkOverlap(
  cstation: readonly CStationAction[], opTimerInterval: string, minInterval: number = 7500
) {
  if (cstation.length === 0)
    return [];

  const interval = parseInt(opTimerInterval);
  const result: CStationAction[] = [];
  let occupyTrain: number = 0;
  let lastTrainLeaveTime: number = -minInterval;

  let checking: boolean = true;
  let i: number = 0;
  while (checking) {
    if (i == cstation.length) {
      // 最初のイベントを完全な状態でチェックしなおして終了
      checking = false;
      i = 0;
    }

    const event = cstation[i];
    const action = event.action;
    const acted = event.acted
    const timeAt = event.timeAt;

    const trainLeave = () => {
      occupyTrain = occupyTrain <= 1 ? 0 : --occupyTrain;
      if (occupyTrain == 0) {
        lastTrainLeaveTime = timeAt;
      }
    }

    const calcTrainInterval = (): number => {
      // 一周してきた場合用
      const calcTimeAt: number = timeAt < lastTrainLeaveTime ? timeAt + interval : timeAt;
      return calcTimeAt - lastTrainLeaveTime;
    }

    const addResult = (newV: CStationAction) => {
      if (!result.some((v) => {
        return v.timeAt == newV.timeAt;
      })) {
        // 時刻が同じオブジェクトが存在しない
        result.push(newV);
      }
    }

    // 通常の検査ルーチン
    if (action === "cstation_leave" && acted) {
      // 発車する動作
      if (occupyTrain > 1) {
        // 二重入線してるうちの片方が発車する(?)パターン。当然ダメ
        addResult(event);
      } 
      trainLeave();
      i++;
      continue;
    }

    
    // 入線を含む動作
    if (occupyTrain !== 0) {
      // 線路に列車が複数いるので当然問題
      addResult(event);
    } else if (calcTrainInterval() < minInterval) {
      // 空き時間が短すぎる場合も問題とする
      addResult(event);
    }

    if (action === "cstation_enter") {
      // 普通に入線する
      occupyTrain++;
      i++;
      continue;
    }
  
    // 普通に通過
    trainLeave();
    i++;
    continue;
  }
  return result;
}