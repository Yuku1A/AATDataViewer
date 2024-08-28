import { MantineProvider } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useMemo, useContext } from "react";
import { CreateWindowContext } from "../CreateWindowContext";
import { useSelector } from "react-redux";
import LSpawnTable from "./LSpawnTable"

export default function LSpawnListSelector({}) {
  const lSpawnListStore = useSelector(state => state.lSpawnListStore);

  const createWindow = useContext(CreateWindowContext);
  const createTableWindow = (lSpawnListName) => {
    createWindow((
      <LSpawnTable
        key={lSpawnListName}
        LSpawnListName={lSpawnListName} />
    ), lSpawnListName + " - LSpawn", 400, 400);
  }

  const keys = useMemo(() => Object.keys(lSpawnListStore), [lSpawnListStore]);

  const columns = useMemo(() => [
    {
      accessorFn: (row) => {
        return row;
      }, 
      id: "lSpawnList", 
      header: "LSpawnList", 
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