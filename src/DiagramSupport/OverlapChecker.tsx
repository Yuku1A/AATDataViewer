import { useMemo } from "react";
import { collectCStation, cStationSimulate } from "../CStation/CStationLogic";
import { checkOverlap } from "../CStation/CStationOverlap";
import { useAppSelector } from "../hook"
import { CStationAction } from "../CStation/CStationTypes";
import { PathAction, PathMutex } from "../Path/PathTypes";
import { generatePathMutex } from "../Path/PathLogic";
import { checkPathOverlap } from "../Path/PathOverlap";
import { LSpawnInfo } from "../LSpawn/LSpawnType";
import { createMRTColumnHelper, MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { MantineProvider } from "@mantine/core";
import { MilliTimeStrToHHmmss } from "../Util/UnitUtil";

type OverlapEvent = {
  readonly timeAt: number;
  readonly lSpawnInfo: LSpawnInfo;
  readonly locationName: string;
  readonly trainName: string;
  readonly locationType: "PathMutex" | "CStation";
}

export default function OverlapChecker() {
  const lSpawnListStore = useAppSelector(state => state.lSpawnListStore);
  const opTimer = useAppSelector(state => state.opTimer);
  const trainRecordStore = useAppSelector(state => state.trainRecordStore);
  const pathMutexInfoStore = useAppSelector(state => state.pathMutexInfoStore);

  const cStationNames = useMemo(() => collectCStation(trainRecordStore), [trainRecordStore]);
  const cStationStates = useMemo(() => {
    const tempStates: {[K: string]: CStationAction[]} = {};
    cStationNames.map((v) => {
      tempStates[v] = cStationSimulate(v, trainRecordStore, lSpawnListStore, opTimer);
    });
    return tempStates;
  }, [trainRecordStore, lSpawnListStore]);

  const cStationResults = useMemo(() => {
    const tempArray: CStationAction[] = [];
    Object.keys(cStationStates).map((v) => {
      tempArray.push(...checkOverlap(cStationStates[v], opTimer.Interval, 7500));
    });
    return tempArray;
  }, [cStationStates]);

  const pathMutexes = useMemo(() => {
    const tempObj: {[K: string]: PathMutex} = {};
    for (const id of Object.keys(pathMutexInfoStore)) {
      tempObj[id] = generatePathMutex(pathMutexInfoStore[id], trainRecordStore, lSpawnListStore, opTimer)
    }
    return tempObj;
  }, [trainRecordStore, lSpawnListStore, pathMutexInfoStore]);

  const pathResults = useMemo(() => {
    const tempArray: (PathAction & { id: string })[] = [];
    for (const id of Object.keys(pathMutexes)) {
      tempArray.push(...checkPathOverlap(pathMutexes[id], opTimer.Interval, 7500).map((v) => {
        return {
          timeAt: v.timeAt, 
          trainName: v.trainName, 
          gatewayName: v.gatewayName, 
          direction: v.direction, 
          lSpawnInfo: v.lSpawnInfo, 
          action: v.action, 
          id: id
        }
      }));
    }
    return tempArray;
  }, [pathMutexes]);

  console.log("path", pathResults);

  const convertCStationActionToDisplayable = (data: CStationAction): OverlapEvent => {
    return {
      timeAt: data.timeAt, 
      trainName: data.trainName, 
      lSpawnInfo: data.lSpawnInfo, 
      locationName: data.cStationName, 
      locationType: "CStation"
    }
  }

  const convertPathActionToDisplayable = (data: PathAction, id: string): OverlapEvent => {
    return {
      timeAt: data.timeAt, 
      trainName: data.trainName, 
      lSpawnInfo: data.lSpawnInfo, 
      locationName: id, 
      locationType: "PathMutex"
    }
  }

  const viewData: OverlapEvent[] = [];

  for (const cStationAction of cStationResults) {
    viewData.push(convertCStationActionToDisplayable(cStationAction));
  }

  for (const pathAction of pathResults) {
    viewData.push(convertPathActionToDisplayable(pathAction, pathAction.id))
  }

  const columnHelper = createMRTColumnHelper<OverlapEvent>();
  const columns = useMemo(() => [
    columnHelper.accessor((row) => row.trainName, {
      id: "trainName", 
      header: "TrainName", 
      grow: false, 
      size: 0
    }), 
    columnHelper.accessor((row) => row.lSpawnInfo.signName, {
      id: "spawnSignName", 
      header: "SpawnSignName", 
      grow: false, 
      size: 0
    }), 
    columnHelper.accessor((row) => {
      return MilliTimeStrToHHmmss(row.lSpawnInfo.info.scheduleTime)
    }, {
      id: "spawnTime", 
      header: "SpawnTime", 
      size: 70, 
      grow: false
    }), 
    columnHelper.accessor((row) => row.locationName, {
      id: "locationName", 
      header: "Location", 
      size: 100
    })
  ], []);

  const table = useMantineReactTable({
    data: viewData, 
    columns: columns, 
    enableSorting: false, 
    enablePagination: false, 
    enableColumnActions: false, 
    enableTopToolbar: false, 
    enableDensityToggle: false, 
    initialState: { density: "xs" }, 
    layoutMode: "grid", 
    enableEditing: false
  })

  return (
    <>
      <p>OverlapChecker</p>
      <MantineProvider>
        <MantineReactTable table={table} />
      </MantineProvider>
    </>
  )
}