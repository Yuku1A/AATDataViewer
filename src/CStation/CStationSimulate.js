export default function CStationSimulate(
  trainRecordStore, lSpawnListStore, cStationName, opTimer) {
  // まず、実際に計算が必要な列車の情報を集める
  const trainNameList = [];
  for (const key of Object.keys(trainRecordStore)) {
    const rec = trainRecordStore[key];
    for (const entry of rec.list) {
      if (entry.trainRecord.signName === cStationName) {
        trainNameList.push(key);
        break;
      }
    }
  }

  // 計算に必要な情報を列車に紐づける
  const trainList = [];
  for (const key of Object.keys(lSpawnListStore)) {
    const lspnlist = lSpawnListStore[key];
    for (const entry of lspnlist.list) {
      for (const trainName of trainNameList) {
        if (entry.spawnTrainName === trainName) {
          trainList.push({
            trainName: trainName, 
            scheduleSpawnTime: entry.scheduleTime, 
            trainRecord: trainRecordStore[trainName]
          });
        }
      }
    }
  }
  
  // 実際の計算をする
  const actionListInCStation = []
  for (const train of trainList) {
    // 実際に計算する列車
    for (const recEntry of train.trainRecord.list) {
      // TrainRecordのエントリ
      const record = recEntry.trainRecord;
      if (record.signName === cStationName) {
        const interval = parseInt(opTimer.Interval);
        const spawnTime = parseInt(train.scheduleSpawnTime);
        const recordedAt = parseInt(recEntry.recordedAt);
        const timeRaw = (spawnTime + recordedAt) % interval;
        actionListInCStation.push({
          timeAt: timeRaw, 
          action: record.actionType, 
          acted: record.acted, 
          trainName: train.trainName
        })
      }
    }
  }

  // できたはず
  return actionListInCStation
}

export function collectCStation(trainRecordStore) {
  const stationNameList = [];
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