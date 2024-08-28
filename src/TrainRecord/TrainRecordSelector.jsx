import { MantineProvider } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useState, useMemo, useContext } from "react";
import { CreateWindowContext } from "../CreateWindowContext";
import { useSelector } from "react-redux";
import { Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CopyGUI from "../Util/CopyGUI";
import { useDispatch } from "react-redux";
import { addTrainRecord } from "./TrainRecordSlice";
import TrainRecordView from "./TrainRecordView";

export default function TrainRecordSelector({}) {
  const trainRecordStore = useSelector(state => state.trainRecordStore);

  const createWindow = useContext(CreateWindowContext);
  const createTableWindow = (trainName) => {
    createWindow((
      <TrainRecordView
        key={trainName}
        trainName={trainName} />
    ), trainName + " - TrainRecord", 400, 400);
  }

  const dispatch = useDispatch();

  const copyItem = (copyFrom, copyTo) => {
    const copyData = structuredClone(trainRecordStore[copyFrom]);
    dispatch(addTrainRecord(copyTo, copyData));
  }

  const keys = useMemo(() => Object.keys(trainRecordStore), [trainRecordStore]);

  const columns = useMemo(() => [
    {
      accessorFn: (row) => {
        return row;
      }, 
      id: "trainName", 
      header: "TrainRecord", 
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
    enableRowActions: true, 
    renderRowActionMenuItems: ({row}) => (
      <>
        <Menu.Item onClick={() => copyWindow(row.getValue("trainName"))}>Copy</Menu.Item>
      </>
    ), 
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "", 
        size: 20
      }
    }
  })

  const [opened, {open, close}] = useDisclosure(false);
  const [copyFrom, setCopyFrom] = useState("");

  const copyWindow = (copyFrom) => {
    setCopyFrom(copyFrom);
    open();
  }

  return (
    <MantineProvider>
      <CopyGUI 
        opened={opened} onClose={close} 
        onCopy={copyItem} copyFrom={copyFrom}
        key={copyFrom} />
      <MantineReactTable table={table} />
    </MantineProvider>
  )
}