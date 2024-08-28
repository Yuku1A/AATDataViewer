import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration"
import * as UnitUtil from "../Util/UnitUtil"
import * as LocLookup from "../LocLookup"
import { MantineProvider } from "@mantine/core";

dayjs.extend(duration);

export default function TrainRecordTable({trainName, trainRecord, onChangeData}) {

  const data = trainRecord;

  const handleTimeEdit = (cell, value) => {
    // 表示されている数値と実際の数値は異なるので
    // 表示されている数値ベースで差分を計算する
    // 古い表示用の数値
    const oldDisplayValue = cell.getValue();
    if (!UnitUtil.isStringHHmmss(oldDisplayValue)) {
      // 差分計算じゃなくて値を入力するのみとする
      return;
    }
    const dayjsOldValue = UnitUtil.HHmmssToDuration(oldDisplayValue);
    
    // 新しい表示用の数値
    const newDisplayValue = value;
    if (!UnitUtil.isStringHHmmss(newDisplayValue)) {
      // ちゃんとしてなかったら元の値を埋めたいが、
      // それができなそうなので他に何もしないとする
      return;
    }
    const dayjsNewValue = UnitUtil.HHmmssToDuration(newDisplayValue);

    // 差分計算
    const dayjsDiffValue = dayjsNewValue.subtract(dayjsOldValue);
    
    // ここから内部作業
    // 差分をミリ秒で取得
    const diffTimeMillis = dayjsDiffValue.asMilliseconds();

    // 内部データに差分を適用していく
    const list = structuredClone(data);
    const cellindex = cell.row.index;
    for (let i = cellindex ; i < list.length ; i++) {
      const record = list[i];
      const intOldRecordedAt = parseInt(record.recordedAt)
      const intNewRecordedAt = intOldRecordedAt + diffTimeMillis;
      record.recordedAt = intNewRecordedAt.toString();
    }

    // 差分適用完了
    onChangeData(list);
  }

  const columns = useMemo(() => [
    {
      accessorFn: (row) => {
        return UnitUtil.MilliTimeStrToHHmmss(row["recordedAt"]);
      }, 
      header: "時間", 
      id: "recordedAt", 
      grow: false, 
      size: 90, 
      mantineEditTextInputProps: ({cell}) => ({
        onBlur: (event) => {
          handleTimeEdit(cell, event.target.value);
        }
      })
    }, 
    {
      accessorFn: (row) => {
        const rawActType = row["trainRecord"]["actionType"];
        if (rawActType === "cstation_leave") {
          if (!row["trainRecord"]["acted"]) {
            return "pass"
          }
        }
        return rawActType;
      }, 
      header: "actionType", 
      id: "actiontype", 
      grow: false, 
      enableEditing: false, 
      size: 100
    }, 
    {
      accessorFn: (row) => {
        const rec = row["trainRecord"];
        return LocLookup.LocLookup(rec["signName"], rec["location"]);
      }, 
      header: "場所の名前", 
      id: "cstationname", 
      grow: true, 
      enableEditing: false, 
      size: 100
    }, 
  ]);

  const table = useMantineReactTable({
    data: data, 
    columns: columns, 
    enableEditing: true, 
    editDisplayMode: "cell", 
    enableSorting: false, 
    enablePagination: false, 
    enableColumnActions: false, 
    enableTopToolbar: false, 
    enableDensityToggle: false, 
    initialState: { density: "xs"}, 
    layoutMode: "grid"
  })

  return (
    <MantineProvider>
      <MantineReactTable table={table} />
    </MantineProvider>
  )
}