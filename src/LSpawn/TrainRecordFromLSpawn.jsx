import TrainRecordTable from "../TrainRecord/TrainRecordTable";
import { useMemo } from "react";
import { useAppSelector } from "../hook";
import { simulateTrainFromLSpawn } from "./LSpawnLogic";

export default function TrainRecordView({
  trainName, spawnTime, interval}) {
  const originalData = useAppSelector((state) => {
    return state.trainRecordStore[trainName].list;
  });

  const data = useMemo(() => {
    return simulateTrainFromLSpawn(
      originalData, spawnTime, interval
    );
  }, [originalData])

  const onChangeData = () => { }

  return (
    <TrainRecordTable 
      trainRecord={data}
      onChangeData={onChangeData}
    />
  )
}