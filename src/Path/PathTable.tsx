import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import * as UnitUtil from "../Util/UnitUtil"
import { MantineProvider } from "@mantine/core";
import { useAppSelector } from "../hook";
import { PathAction, PathMutex, PathMutexInfo } from "./PathTypes";
import { generatePathMutex } from "./PathLogic";

export default function PathTable({pathMutexInfo}: {
  pathMutexInfo: PathMutexInfo, 
}) {
  const trainRecordStore = useAppSelector((state) => state.trainRecordStore);
  const lSpawnListStore = useAppSelector((state) => state.lSpawnListStore);
  const opTimer = useAppSelector((state) => state.opTimer);

  const data = useMemo((): PathMutex => {
    return generatePathMutex(pathMutexInfo, trainRecordStore, lSpawnListStore, opTimer);
  }, [trainRecordStore, lSpawnListStore]);

  const columns = useMemo(() => [
    {
      accessorFn: (row: PathAction) => {
        return UnitUtil.MilliTimeStrToHHmmss(row.timeAt);
      }, 
      header: "時間", 
      id: "timeAt", 
      grow: false, 
      size: 72, 
    }, 
    {
      accessorFn: (row: PathAction) => row.trainName, 
      header: "trainName", 
      id: "trainName", 
      size: 100
    }, 
    {
      accessorFn: (row: PathAction) => {
        const action = row.action;
        if (action === "path_enter")
          return "enter";
        else
          return "leave";
      }, 
      header: "action", 
      id: "action", 
      grow: false, 
      size: 50
    }, 
    {
      accessorFn: (row: PathAction) => {
        return row.direction;
      }, 
      header: "direction", 
      id: "direction", 
      grow: false, 
      size: 75
    }, 
    {
      accessorFn: (row: PathAction) => {
        return row.gatewayName;
      }, 
      header: "gateway", 
      id: "gateway", 
      size: 100
    }
  ], []);

  const table = useMantineReactTable({
    data: data.actionsList, 
    columns: columns, 
    enableSorting: false, 
    enablePagination: false, 
    enableColumnActions: false, 
    enableTopToolbar: false, 
    enableDensityToggle: false, 
    initialState: { density: "xs"}, 
    layoutMode: "grid", 
    enableEditing: false
  })

  return (
    <MantineProvider>
      <MantineReactTable table={table} />
    </MantineProvider>
  )
}