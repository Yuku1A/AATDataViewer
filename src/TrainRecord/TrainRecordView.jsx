import TrainRecordTable from "./TrainRecordTable";
import { changeTrainRecord } from "./TrainRecordSlice";
import { useDispatch, useSelector } from "react-redux";


export default function TrainRecordView({trainName}) {
  const data = useSelector((state) => {
    return state.trainRecordStore[trainName].list;
  });

  const dispatch = useDispatch();

  const onChangeData = (list) => {
    dispatch(changeTrainRecord(trainName, list));
  }

  return (
    <TrainRecordTable 
      trainRecord={data}
      onChangeData={onChangeData}
    />
  )
}