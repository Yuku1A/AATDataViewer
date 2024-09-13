import * as FileUtil from "./Util/FileUtil"
import { useDispatch } from "react-redux";
import { loadTrainRecordStore } from "./TrainRecord/TrainRecordSlice";
import { loadLSpawnListStore } from "./LSpawn/LSpawnSlice";
import { loadOPTimerStore } from "./OPTimer/OPTimerSlice";
import FileDropArea from "./Util/FileDropArea";
import { ReactNode } from "react";

export default function ReadYamlData({children}: {
  children: ReactNode
}) {
  const dispatch = useDispatch();

  const onFileDrop = async (file: File) => {
    const ymlobj = await FileUtil.readYamlFile(file);
    loadData(ymlobj);
  }

  const loadData = (ymlobj) => {
    dispatch(loadTrainRecordStore(ymlobj["trainrecord"]));
    dispatch(loadLSpawnListStore(ymlobj["lspawn"]));
    dispatch(loadOPTimerStore(ymlobj["optimer"]));
  }

  return (
    <FileDropArea
      onDropFile={onFileDrop}>
      {children}
    </FileDropArea>
  )
}