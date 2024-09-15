export type LSpawnInfo = {
  signName: string;
  info: LSpawn;
}

export type LSpawnList = {
  timer: string, 
  list: LSpawn[]
}

export type LSpawn = {
  spawnTrainName: string, 
  /** stringでdumpされるのでstringで保持 */
  scheduleTime: string
}