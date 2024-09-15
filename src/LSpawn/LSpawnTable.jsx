import { useContext, useMemo, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration"
import * as UnitUtil from "../Util/UnitUtil"
import { 
  Button, MantineProvider, Space, Text, TextInput, Box, 
  ActionIcon
} from "@mantine/core";
import { useDispatch} from "react-redux";
import { changeLSpawnList } from "./LSpawnSlice";
import "./LSpawnTable.css"
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { IconTrashX, IconDatabaseEdit, IconExternalLink } from "@tabler/icons-react";
import { CreateWindowContext } from "../CreateWindowContext";
import TrainRecordFromLSpawn from "./TrainRecordFromLSpawn"
import { useAppSelector } from "../hook";

dayjs.extend(duration);

export default function LSpawnTable({LSpawnListName}) {
  const dispatch = useDispatch();

  const data = useAppSelector((state) => {
    return state.lSpawnListStore[LSpawnListName].list;
  });
  const opTimer = useAppSelector((state) => state.opTimer);

  const onChangeList = (value) => {
    value.sort((a, b) => {
      const aTimeMillis = parseInt(a.scheduleTime);
      const bTimeMillis = parseInt(b.scheduleTime);

      return aTimeMillis - bTimeMillis;
    })
    dispatch(changeLSpawnList(LSpawnListName, value));
  }

  const onEditRow = ({table, row, values}) => {
    // 必要な情報を集める
    const newScheduleTimeStringHHmmss = values.scheduleTime;
    const newSpawnTrainName = values.trainName;
    // チェック
    if (!UnitUtil.isStringHHmmss(newScheduleTimeStringHHmmss))
      table.setEditingRow(null);

    // ミリ秒に変換
    const dayjsNewValue = UnitUtil.HHmmssToDuration(newScheduleTimeStringHHmmss);
    const newScheduleTimeNumberMillis = dayjsNewValue.asMilliseconds();

    // Intervalをはみ出してないかチェック
    const intervalNumberMillis = parseInt(opTimer["Interval"]);
    if (newScheduleTimeNumberMillis >= intervalNumberMillis)
      table.setEditingRow(null);

    // 正常だったらうまいこと登録
    const list = structuredClone(data);
    const newData = {
      scheduleTime: newScheduleTimeNumberMillis.toString(), 
      spawnTrainName: newSpawnTrainName
    };
    list[row.index] = newData;

    // 完了
    onChangeList(list);
    table.setEditingRow(null);
  }

  const columns = useMemo(() => [
    {
      accessorFn: (row) => {
        return UnitUtil.MilliTimeStrToHHmmss(row["scheduleTime"]);
      }, 
      header: "時間", 
      id: "scheduleTime", 
      grow: false, 
      size: 90, 
    }, 
    {
      accessorFn: (row) => row["spawnTrainName"], 
      header: "列車の名前", 
      id: "trainName", 
      grow: false, 
      enableEditing: true, 
      size: 100
    }, 
  ]);

  const removeLSpawn = (index) => {
    const list = structuredClone(data);
    list.splice(index, 1);
    onChangeList(list);
  }

  const createWindow = useContext(CreateWindowContext);

  const openTrainRecord = (row) => {
    const rowData = row.original;
    console.log(rowData);
    createWindow(
      <TrainRecordFromLSpawn
        trainName={rowData.spawnTrainName}
        spawnTime={rowData.scheduleTime}
        interval={opTimer.Interval} />, (
        rowData.spawnTrainName + " - " + 
        UnitUtil.MilliTimeStrToHHmmss(rowData.scheduleTime) + 
        " - TrainRecord"
      ), 400, 400
    )
  }

  const table = useMantineReactTable({
    data: data, 
    columns: columns, 
    enableEditing: true, 
    editDisplayMode: "row", 
    enableSorting: false, 
    enablePagination: false, 
    enableColumnActions: false, 
    enableTopToolbar: false, 
    enableDensityToggle: false, 
    initialState: { density: "xs"}, 
    layoutMode: "grid", 
    onEditingRowSave: onEditRow, 
    renderRowActions: ({row}) => (
      <Box 
        style={{
          display: "flex", 
          flexWrap: "nowrap", 
          gap: "8px"
        }}>
        <ActionIcon
          onClick={() => table.setEditingRow(row)}
          variant="subtle"
          color="black">
          <IconDatabaseEdit />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="black"
          onClick={() => removeLSpawn(row.index)}>
          <IconTrashX />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="black"
          onClick={() => openTrainRecord(row)}>
          <IconExternalLink />
        </ActionIcon>
      </Box>
    )
  })

  const [opened, {open, close}] = useDisclosure(false);
  const [modalKey, setModalKey] = useState("");
  const addModal = () => {
    setModalKey(Math.random().toString());
    open();
  }

  const addLSpawn = (time, name) => {
    const scheduleTimeDuration = UnitUtil.HHmmssToDuration(time)
    const scheduleTime = scheduleTimeDuration.asMilliseconds();
    const list = structuredClone(data);
    list.push({
      scheduleTime: scheduleTime, 
      spawnTrainName: name
    });
    onChangeList(list);
    close();
  }

  return (
    <MantineProvider>
      <LSpawnAddModal
        opened={opened} onClose={close} key={modalKey}
        onAdd={addLSpawn} interval={opTimer.Interval}/>
      <div className="lspnTop">
        <Text className="lspnTopText">
          {
            "OPTimer Interval: " + UnitUtil.MilliTimeStrToHHmmss(opTimer["Interval"])
          } 
        </Text>
        <Button 
          className="lspnAddButton"
          size="compact-md"
          onClick={() => addModal()}>
          Add
        </Button>
      </div>
      
      <MantineReactTable table={table} />
    </MantineProvider>
  )
}

function LSpawnAddModal({opened, onClose, onAdd, interval}) {
  const intervalMillis = parseInt(interval);

  const [timeValue, setTimeValue] = useState("");
  const [timeError, setTimeError] = useState(true);
  const isValidTime = (value) => {
    if (UnitUtil.isStringHHmmss(value)){
      const timeDuration = UnitUtil.HHmmssToDuration(value);
      const timeMillis = timeDuration.asMilliseconds();
      if (timeMillis <= intervalMillis)
        return true;
      return false;
    } else {
      return false;
    }
  }

  const inputTimeValue = (value) => {
    if (isValidTime(value))
      setTimeError(false);
    else
      setTimeError(true);

    setTimeValue(value);
  }

  const [nameValue, setNameValue] = useState("");

  const onAddButton = () => {
    if (!timeError) {
      onAdd(timeValue, nameValue);
    }
  }

  return (
    <Modal 
      opened={opened} onClose={onClose} centered
      withCloseButton={false}>
      <TextInput
        label="スポーンする時間"
        value={timeValue}
        onChange={(e) => inputTimeValue(e.currentTarget.value)}
        error={timeError}
      />
      <TextInput
        label="列車の名前"
        value={nameValue}
        onChange={(e) => setNameValue(e.currentTarget.value)} />
      <Space h="md" />
      <Button
        onClick={() => onAddButton()}>
        Add
      </Button>
    </Modal>
  );
}