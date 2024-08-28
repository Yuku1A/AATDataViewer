import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration"
import * as UnitUtil from "../Util/UnitUtil"
import { MantineProvider } from "@mantine/core";
import { useSelector } from "react-redux";
import CStationSimulate from "./CStationSimulate";

dayjs.extend(duration);

export default function CStationTable({CStationName}) {
  const trainRecordStore = useSelector((state) => state.trainRecordStore);
  const lSpawnListStore = useSelector((state) => state.lSpawnListStore);
  const opTimer = useSelector((state) => state.opTimer);

  const data = useMemo(() => {
    const listBeforeSort =  CStationSimulate(
      trainRecordStore, lSpawnListStore, CStationName, opTimer);
    return listBeforeSort.sort((a, b) => {
      const aTimeMillis = parseInt(a.timeAt);
      const bTimeMillis = parseInt(b.timeAt);

      return aTimeMillis - bTimeMillis;
    })
  }, [trainRecordStore, lSpawnListStore]);

  const columns = useMemo(() => [
    {
      accessorFn: (row) => {
        return UnitUtil.MilliTimeStrToHHmmss(row["timeAt"]);
      }, 
      header: "時間", 
      id: "timeAt", 
      grow: false, 
      size: 72, 
    }, 
    {
      accessorFn: (row) => row["trainName"], 
      header: "trainName", 
      id: "trainName", 
      size: 100
    }, 
    {
      accessorFn: (row) => {
        const action = row["action"];
        const acted = row["acted"];
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
  ]);

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