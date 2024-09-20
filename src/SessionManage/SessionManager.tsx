import "./SessionManager.css";
import { useMemo, useState } from "react";
import { Button, MantineProvider, Menu, Modal, TextInput } from "@mantine/core";
import { createMRTColumnHelper, MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useLiveQuery } from "dexie-react-hooks";
import * as db from "./db";
import { useAppDispatch, useAppSelector } from "../hook";
import { useDisclosure } from "@mantine/hooks";
import Session from "./Session";
import { changeSessionName } from "./SessionNameSlice";
import { loadTrainRecordStore } from "../TrainRecord/TrainRecordSlice";
import { loadLSpawnListStore } from "../LSpawn/LSpawnSlice";
import { loadOPTimerStore } from "../OPTimer/OPTimerSlice";
import FileDropArea from "../Util/FileDropArea";
import * as FileUtil from "../Util/FileUtil";
import { saveAs } from "file-saver";
import { stringArrayToWrapper, StringWrapper } from "../Util/StringWrapper";

export default function SessionManager() {
  const tempSessions = useLiveQuery(db.getKeys);
  
  let sessions: StringWrapper[];

  if (typeof tempSessions === "undefined") {
    sessions = [];
  } else {
    sessions = stringArrayToWrapper(tempSessions);
  }

  const trainRecordStore = useAppSelector(state => state.trainRecordStore);
  const opTimer = useAppSelector(state => state.opTimer);
  const lSpawnListStore = useAppSelector(state => state.lSpawnListStore);
  const sessionTitle = useAppSelector(state => state.sessionName);
  const dispatch = useAppDispatch();

  const createSessionJson = (sessionName: string) => {
    const newSessionObj = new Session(
      sessionName, trainRecordStore, opTimer, lSpawnListStore
    )

    return JSON.stringify(newSessionObj);
  }

  const overWriteSaveButton = () => {
    const jsonStr = createSessionJson(sessionTitle);
    db.put(sessionTitle, jsonStr);
  }

  const newSaveButton = (newSessionName: string) => {
    console.log("NewSave: " + newSessionName);
    const jsonStr = createSessionJson(newSessionName);
    db.put(newSessionName, jsonStr);
    dispatch(changeSessionName(newSessionName));
  }

  const loadSession = async (loadSessionName: string) => {
    const sessionJson = await db.get(loadSessionName);
    const sessionObj: unknown = JSON.parse(sessionJson);
    if (!Session.isThis(sessionObj))
      throw new Error();

    dispatch(changeSessionName(sessionObj.sessionName));
    dispatch(loadLSpawnListStore(sessionObj.lSpawnList));
    dispatch(loadOPTimerStore(sessionObj.opTimer));
    dispatch(loadTrainRecordStore(sessionObj.trainRecord));
  }

  const onDropFile = async (file: File) => {
    const text = await FileUtil.readTextFile(file);
    const sessionObj = JSON.parse(text);
    if (!Session.isThis(sessionObj))
      return;

    await db.put(sessionObj.sessionName, text);
  }

  const fileOutput = async (sessionName: string) => {
    const sessionJsonTxt = await db.get(sessionName);
    const blob = new Blob([sessionJsonTxt], {type: "text/plain;charset=utf-8"});
    saveAs(blob, sessionName + ".json")
  }

  const deleteSession = async (sessionName: string) => {
    await db.remove(sessionName);
  }

  const columnHelper = createMRTColumnHelper<StringWrapper>();

  const columns = useMemo(() => [
    columnHelper.accessor((row) => row.value, {
      id: "session", 
      header: "Session", 
      Header: () => (<div></div>), 
      mantineTableBodyCellProps: ({cell}) => ({
        onClick: () => {
          loadSession(cell.getValue())
        }
      })
    }), 
  ], []);

  const table = useMantineReactTable({
    data: sessions, 
    columns: columns, 
    enableSorting: false, 
    enableDensityToggle: false, 
    enablePagination: false, 
    enableColumnActions: false, 
    enableTopToolbar: false, 
    enableColumnFilters: true, 
    initialState: {
      density: "xs", 
      showColumnFilters: true, 
    }, 
    enableRowActions: true, 
    renderRowActionMenuItems: ({row}) => {
      return (
        <>
          <Menu.Item onClick={() => fileOutput(row.original.value)}>Export</Menu.Item>
          <Menu.Item onClick={() => deleteSession(row.original.value)}>Remove</Menu.Item>
        </>
      )
    }, 
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "", 
        size: 20
      }
    }
  })

  const [newSaveOpened, {open: newSaveOpen, close: newSaveClose}] = useDisclosure(false);

  return (
    <MantineProvider>
      <FileDropArea onDropFile={onDropFile}>
        <NewSessionSaveModal 
          opened={newSaveOpened}
          onClose={newSaveClose}
          onNewSave={newSaveButton}
        />
        <div className="SessionManagerTop">
          <div>現在のセッション名: {sessionTitle}</div>
          <div>ここにセッションファイルをD&Dしてセッションをインポート</div>
          <Button onClick={newSaveOpen}>New Save</Button>
          <Button onClick={overWriteSaveButton}>OverWrite Save</Button>
          { 
            // 要素ごとに削除ボタンとエクスポートボタンを設置する
          }
        </div>
        <MantineReactTable table={table} />
      </FileDropArea>
    </MantineProvider>
  )
}

function NewSessionSaveModal({opened, onClose, onNewSave}: {
  opened: boolean,
  onClose: () => void, 
  onNewSave: (newSessionName: string) => void
}) {
  const [name, setName] = useState("");

  const onButtonClick = () => {
    onNewSave(name);
    onClose();
  }

  return (
    <Modal 
      opened={opened} onClose={onClose} centered 
      withCloseButton={false}>
      <TextInput 
        label="セーブする名前"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <Button onClick={onButtonClick}>
        New Save
      </Button>
    </Modal>
  )
  
}