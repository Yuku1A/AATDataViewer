import TrainRecordTable from "../TrainRecord/TrainRecordTable";
import { useSelector } from "react-redux";
import { TimeCalcInInterval } from "../Util/TimeUtil";
import { useMemo } from "react";

export default function TrainRecordView({
  trainName, spawnTime, interval}) {
  const originalData = useSelector((state) => {
    return state.trainRecordStore[trainName].list;
  });

  const data = useMemo(() => {
    const list = [];
    for (var originalEntry of originalData) {
      const entry = structuredClone(originalEntry);
      entry.recordedAt = TimeCalcInInterval(entry.recordedAt, spawnTime, interval);
      list.push(entry);
    }
    return list;
  }, [originalData])

  const onChangeData = () => { }

  return (
    <TrainRecordTable 
      trainRecord={data}
      onChangeData={onChangeData}
    />
  )
}