import { Button, Flex, Grid, MantineProvider, Modal, Space, Text, TextInput } from "@mantine/core";
import { createMRTColumnHelper, MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useState, useMemo, useContext } from "react";
import { CreateWindowContext } from "../CreateWindowContext";
import { Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAppDispatch, useAppSelector } from "../hook";
import PathView from "./PathView";
import { changePathMutexInfo, deletePathMutexInfo } from "./PathSlice";
import { stringArrayToWrapper, StringWrapper } from "../Util/StringWrapper";
import { PathMutexInfo } from "./PathTypes";
import "./PathSelector.css";

export default function PathSelector() {
  const pathMutexInfoStore = useAppSelector(state => state.pathMutexInfoStore);

  const createWindow = useContext(CreateWindowContext);
  const createTableWindow = (PathName: string) => {
    createWindow((
      <PathView
        key={PathName}
        pathName={PathName} />
    ), PathName + " - PathMutex", 400, 500);
  }

  const dispatch = useAppDispatch();

  const deleteButton = (name: string) => {
    dispatch(deletePathMutexInfo(name));
  }

  const addPathMutex = (value: PathMutexInfo) => {
    dispatch(changePathMutexInfo(value));
  }

  const keys = useMemo(
    () => stringArrayToWrapper(Object.keys(pathMutexInfoStore)), 
    [pathMutexInfoStore]
  );

  const columnHelper = createMRTColumnHelper<StringWrapper>();

  const columns = useMemo(() => [
    columnHelper.accessor((row) => row.value, {
      id: "pathMutex", 
      header: "PathMutex", 
      Header: () => (<div></div>), 
      mantineTableBodyCellProps: ({cell}) => ({
        onClick: () => createTableWindow(cell.getValue())
      })
    }), 
  ], []);

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
    enableRowActions: true, 
    renderRowActionMenuItems: ({row}) => (
      <>
        <Menu.Item onClick={() => deleteButton(row.original.value)}>Delete</Menu.Item>
      </>
    ), 
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "", 
        size: 20
      }
    }
  });

  const [modalKey, setModalKey] = useState("0");
  const [opened, {open, close}] = useDisclosure(false)
  const onPathAddModalClose = () => {
    close();
    setModalKey(((parseInt(modalKey)) + 1).toString());
  }

  return (
    <MantineProvider>
      <PathAddModal
        opened={opened} onClose={onPathAddModalClose} onAdd={addPathMutex} key={modalKey}/>
      <Flex justify="flex-end">
        <Button className="PathAddButton" onClick={open}>Add</Button>
      </Flex>
      <MantineReactTable table={table} />
    </MantineProvider>
  )
}

function PathAddModal({opened, onClose, onAdd}: {
  opened: boolean, 
  onClose: () => void, 
  onAdd: (value: PathMutexInfo) => void
}) {
  const [startInputs, setStartInputs] = useState<StringWithKey[]>([
    {key: "0", value: ""}
  ]);

  const [endInputs, setEndInputs] = useState<StringWithKey[]>([
    {key: "0", value: ""}
  ]);

  const [pathMutexName, setPathMutexName] = useState("");

  const [betweenInputs, setBetweenInputs] = useState<StringWithKey[]>([
    {key: "0", value: ""}
  ]);

  const onAddButton = () => {
    const startArray: string[] = []
    startInputs.forEach((v) => {
      if (v.value !== "")
        startArray.push(v.value);
    })

    const endArray: string[] = []
    endInputs.forEach((v) => {
      if (v.value !== "")
        endArray.push(v.value);
    })

    const betweenArray: string[] = []
    betweenInputs.forEach((v) => {
      if (v.value !== "")
        betweenArray.push(v.value);
    })
    onAdd({
      startGateways: startArray, 
      endGateways: endArray, 
      id: pathMutexName, 
      serializable: true, 
      betweenPoints: betweenArray
    });
    onClose();
  }

  return (
    <Modal opened={opened} onClose={onClose} centered size="80%">
      <Grid>
        <Grid.Col span={3}>
          <Text ta="center">起点</Text>
          <VariadicTextInput inputValues={startInputs} onInputChanged={setStartInputs} />
        </Grid.Col>
        <Grid.Col offset={1} span={4}>
          <Text ta="center">通過地点(上が起点側)</Text>
          <VariadicTextInput inputValues={betweenInputs} onInputChanged={setBetweenInputs} />
        </Grid.Col>
        <Grid.Col offset={1} span={3}>
          <Text ta="center">終点</Text>
          <VariadicTextInput inputValues={endInputs} onInputChanged={setEndInputs} />
        </Grid.Col>
      </Grid>
      <Space h="md" />
      <div>起点から終点の構内までを含めて一区間としたい場合は、通過地点に終点駅を含めてください</div>
      <Space h="lg" />
      <div>このPathMutexの名前(内部の識別用にも利用されます)</div>
      <TextInput onChange={(event) => setPathMutexName(event.currentTarget.value)} />
      <Space h="md" />
      <Flex justify="flex-end">
        <Button onClick={onAddButton}>Add</Button>
      </Flex>
      

    </Modal>
  )
}

type StringWithKey = {
  key: string, 
  value: string;
};

function VariadicTextInput({inputValues, onInputChanged}: {
  inputValues: StringWithKey[], 
  onInputChanged: (value: StringWithKey[]) => void
}) {
  
  const changeInput = (key: string, value: string) => {
    const newValue = [...inputValues];
    newValue[key].value = value;
    onInputChanged(newValue)
  }

  const addInputArea = () => {
    const newKey = inputValues.length.toString();
    onInputChanged([...inputValues, {key: newKey, value: ""}]);
  };

  const InputElements = inputValues.map((v) => {
    return (
      <TextInput key={v.key} onChange={(event) => {
        changeInput(v.key, event.currentTarget.value)
      }} />
    )
  });

  return (
    <>
      {InputElements}
      <Button variant="subtle" fullWidth onClick={addInputArea}>+</Button>
    </>
  )
}