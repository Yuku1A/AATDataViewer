import { useSelector } from "react-redux";

export default function StationManage({}) {
  const trainRecordStore = useSelector((state) => {
    return state.trainRecordStore;
  });

  const lSpawnListStore = useSelector((state) => {
    return state.lSpawnListStore;
  });

  const opTimer = useSelector((state) => {
    return state.opTimer;
  });


}