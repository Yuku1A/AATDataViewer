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
import SessionManager from "./SessionManage/SessionManager";
import { useAppSelector } from "./hook";

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

  const sessionManager = () => {
    createWindow(
      <SessionManager />, 
      "SessionManager", 
      400, 400
    )
  }

  const sessionName = useAppSelector(state => state.sessionName);

  return (
    <MantineProvider>
      <div className="DataManageView">
        <ReadYamlData>
          <div>
            現在のセッション: {sessionName}
          </div>
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
          <NavLink
            label="SessionManager"
            onClick={() => sessionManager()} />
        </ReadYamlData>
      </div>
    </MantineProvider>
  )
} 