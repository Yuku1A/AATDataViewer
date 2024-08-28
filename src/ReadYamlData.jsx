import * as FileUtil from "./Util/FileUtil"
import { useDispatch } from "react-redux";
import { loadTrainRecordStore } from "./TrainRecord/TrainRecordSlice";
import { loadLSpawnListStore } from "./LSpawn/LSpawnSlice";
import { loadOPTimerStore } from "./OPTimer/OPTimerSlice";

export default function ReadYamlData({children}) {
  const dispatch = useDispatch();
  
  const onDrop = async (e) => {
    e.preventDefault();
  
    const item = e.dataTransfer.items[0];
    if (item.kind !== "file")
      return;
  
    const file = item.getAsFile();
    const ymlobj = await FileUtil.readYamlFile(file);
    loadData(ymlobj);
  }

  const loadData = (ymlobj) => {
    dispatch(loadTrainRecordStore(ymlobj["trainrecord"]));
    dispatch(loadLSpawnListStore(ymlobj["lspawn"]));
    dispatch(loadOPTimerStore(ymlobj["optimer"]));
  }

  return (
    <>
      <div 
        onDrop={(e) => onDrop(e)} 
        onDragOver={(e) => e.preventDefault()}
        className="ReadYamlData">
        {children}
      </div>
    </>
  )
}