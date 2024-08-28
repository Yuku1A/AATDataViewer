import { useContext } from "react";
import ReadYamlData from "./ReadYamlData";
import TrainRecordSelector from "./TrainRecord/TrainRecordSelector";
import ErrorBoundary from "./ErrorBoundary"
import "./DataManageView.css"
import { CreateWindowContext } from "./CreateWindowContext";
import { Divider, MantineProvider } from "@mantine/core";
import { NavLink } from "@mantine/core";
import LSpawnListSelector from "./LSpawn/LSpawnListSelector";
import CStationSelector from "./CStation/CStationSelector";

export default function DataManageView() {
  const createWindow = useContext(CreateWindowContext);

  const trainRecordSelector = () => {
    createWindow(
      <ErrorBoundary fallback={
        <div>データを読み込んでから実行してください</div>
      }>
        <TrainRecordSelector />
      </ErrorBoundary>
      , 
      "TrainRecordを選択", 
      300, 250
    );
  }

  const lSpawnListSelector = () => {
    createWindow(
      <LSpawnListSelector />, 
      "LSpawnListを選択", 
      300, 250
    )
  }

  const cStationSelector = () => {
    createWindow(
      <CStationSelector />, 
      "CStationを選択", 
      300, 250
    )
  }

  return (
    <MantineProvider>
      <div className="DataManageView">
        <ReadYamlData>
          <div className="ReadNewSession">
            ここにデータをD&Dして新しいセッションを開始
          </div>
          <Divider />
          <NavLink 
            label="TrainRecordを開く"
            onClick={() => trainRecordSelector()}/>
          <NavLink
            label="LSpawnListを開く"
            onClick={() => lSpawnListSelector()} />
          <NavLink
            label="CStationを開く"
            onClick={() => cStationSelector()} />
        </ReadYamlData>
      </div>
    </MantineProvider>
  )
} 