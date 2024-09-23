import { LSpawnInfo } from "../LSpawn/LSpawnType";

/** 向かっていく方向、returnは入って同じ場所から出る */
export type PathDirection = "start" | "end" | "start_return" | "end_return";
export type PathActionType = "path_enter" | "path_leave";

export type PathAction = {
  readonly timeAt: number;
  readonly gatewayName: string;
  readonly trainName: string;
  readonly direction: PathDirection;
  readonly lSpawnInfo: LSpawnInfo;
  readonly action: PathActionType;
}

export type PathMutexBase = {
  readonly startGateways: string[];
  readonly endGateways: string[];
  readonly betweenPoints: string[];
  readonly id: string;
}

/** Reduxなどに保存する場合どうにかしてこれに変換してください */
export type PathMutexInfo = PathMutexBase & {
  readonly serializable: true
}

/** JavaScriptの中に留まる使用を想定したオブジェクトです */
export type PathMutex = PathMutexBase & {
  actionsList: PathAction[];
};