import { PathAction, PathDirection, PathMutex, PathMutexInfo } from "./PathTypes";

export function checkPathOverlap(
  path: PathMutex, opTimerInterval: string, minInterval: number=7500
): PathAction[] {
  const events = path.actionsList;
  if (events.length === 0) {
    return [];
  }

  const result: PathAction[] = [];

  const interval = parseInt(opTimerInterval);

  let lastDirection: PathDirection | undefined = undefined;
  let lastTrainLeaveTime = -minInterval;
  let occupyTrain = 0;

  let checking = true;
  let i = 0;
  while (checking) {
    if (i == events.length) {
      // 最初のイベントを完全な状態でチェックしなおして終了
      checking = false;
      i = 0;
    }

    const event = events[i];
    const action = event.action;
    const direction = event.direction;
    const timeAt = event.timeAt;

    const calcTrainInterval = (): number => {
      // 一周してきた場合用
      const calcTimeAt: number = timeAt < lastTrainLeaveTime ? timeAt + interval : timeAt;
      return calcTimeAt - lastTrainLeaveTime;
    }

    const addResult = () => {
      result.push(event);
    }

    if (action === "path_enter") {
      if (occupyTrain !== 0) {
        if (
          lastDirection !== direction || 
          lastDirection === "end_return" || 
          lastDirection === "start_return"
        ) {
          // 同じ方向ではない複数の列車
          addResult();
        }
      }

      // 空き時間が短すぎる場合も対象
      if (calcTrainInterval() < minInterval) {
        addResult();
      }

      lastDirection = direction;
      occupyTrain++;
    } else {
      occupyTrain--;
    }

    i++;
  }

  return result;
}