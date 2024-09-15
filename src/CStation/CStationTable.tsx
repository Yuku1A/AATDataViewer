import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration"
import * as UnitUtil from "../Util/UnitUtil"
import { MantineProvider } from "@mantine/core";
import { cStationSimulate, sortCStationActions } from "./CStationLogic";
import { useAppSelector } from "../hook";
import { CStationAction } from "./CStationTypes";

dayjs.extend(duration);

export default function CStationTable({CStationName}) {
  const trainRecordStore = useAppSelector((state) => state.trainRecordStore);
  const lSpawnListStore = useAppSelector((state) => state.lSpawnListStore);
  const opTimer = useAppSelector((state) => state.opTimer);

  const data = useMemo((): CStationAction[] => {
    const listBeforeSort =  cStationSimulate(
      CStationName, trainRecordStore, lSpawnListStore, opTimer);
      return sortCStationActions(listBeforeSort);
  }, [trainRecordStore, lSpawnListStore]);

  const columns = useMemo(() => [
    {
      accessorFn: (row: CStationAction) => {
        return UnitUtil.MilliTimeStrToHHmmss(row.timeAt);
      }, 
      header: "時間", 
      id: "timeAt", 
      grow: false, 
      size: 72, 
    }, 
    {
      accessorFn: (row: CStationAction) => row.trainName, 
      header: "trainName", 
      id: "trainName", 
      size: 100
    }, 
    {
      accessorFn: (row: CStationAction) => {
        const action = row.action;
        const acted = row.acted;
        if (!acted)
          return "pass";
        if (action === "cstation_enter")
          return "enter";
        else
          return "leave";
      }, 
      header: "action", 
      id: "action", 
      grow: false, 
      enableEditing: false, 
      size: 50
    }, 
  ], []);

  const table = useMantineReactTable({
    data: data, 
    columns: columns, 
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