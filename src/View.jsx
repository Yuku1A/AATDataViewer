import '@mantine/core/styles.css'
import { WindowSystem } from "react-window-system";
import { useState } from "react";
import "./View.css"
import DataManageView from './DataManageView';
import { CreateWindowContext } from "./CreateWindowContext";

export default function View() {
  const createWindow = (jsx, title, height = 200, width = 200) => {
    
    setWindows((windows) => {return [
      ...windows, 
      WindowGenerator(jsx, title, height, width)
    ]});
  }

  const defaultWindows = [
    WindowGenerator(
      <DataManageView />, "DataManager", 
      500, 500, ((window.innerWidth - 500) / 2), ((window.innerHeight - 500) / 2), ((window.innerWidth - 500) / 2)
    )
  ]

  const [windows, setWindows] = useState(defaultWindows)
  
  return (
    <CreateWindowContext.Provider value={createWindow}>
      <WindowSystem 
        windows={windows}  
        style={{
          width: window.innerWidth, 
          height: window.innerHeight
        }}
        
      />
    </CreateWindowContext.Provider>
  )
}

function WindowGenerator(
  jsx, title = "Window", height = 200, width = 200, 
  x = 300 * Math.random(), y = 250 * Math.random()) {
  return {
    id: `${Math.random()}`, 
    defaultWindowPos: {
      x: x, 
      y: y, 
      height: height, 
      width: width
    }, 
    header: <strong>{title}</strong>, 
    body: jsx
  }
}