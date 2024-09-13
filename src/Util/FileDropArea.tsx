import "./FileDropArea.css"
import { ReactNode } from "react";

export default function FileDropArea({children, onDropFile}: {
  children: ReactNode, 
  onDropFile: (file: File) => void
}) {
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();

    const item = e.dataTransfer.items[0];

    if (item.kind !== "file")
      return;
  
    const file = item.getAsFile();
    if (file === null)
      return;

    onDropFile(file);
  }

  return (
    <>
      <div 
        onDrop={(e) => onDrop(e)} 
        onDragOver={(e) => e.preventDefault()}
        className="FileDropArea">
        {children}
      </div>
    </>
  )
}