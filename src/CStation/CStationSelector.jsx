import { MantineProvider } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useMemo, useContext } from "react";
import { CreateWindowContext } from "../CreateWindowContext";
import { useSelector } from "react-redux";
import CStationTable from "./CStationTable";
import { collectCStation } from "./CStationSimulate";

export default function CStationSelector({}) {
  // keyを作る
  const trainRecordStore = useSelector(state => state.trainRecordStore);

  const keys = useMemo(() => {
    return collectCStation(trainRecordStore);
  }, [trainRecordStore]);

  const createWindow = useContext(CreateWindowContext);
  const createTableWindow = (cStationName) => {
    createWindow((
      <CStationTable
        key={cStationName}
        CStationName={cStationName} />
    ), cStationName + " - CStation", 400, 400);
  }

  const columns = useMemo(() => [
    {
      accessorFn: (row) => {
        return row;
      }, 
      id: "cStation", 
      header: "CStation", 
      Header: () => (<div></div>), 
    }
  ])

  const table = useMantineReactTable({
    data: keys, 
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
    mantineTableBodyCellProps: ({cell}) => ({
      onClick: () => {
        createTableWindow(cell.getValue());
      }
    }), 
  })

  return (
    <MantineProvider>
      <MantineReactTable table={table} />
    </MantineProvider>
  )
}