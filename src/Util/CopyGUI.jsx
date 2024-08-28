import { useState } from "react"
import { Modal } from "@mantine/core"
import { TextInput } from "@mantine/core"
import { Button } from "@mantine/core";

export default function CopyGUI({opened, onClose, onCopy, copyFrom}) {
  const [value, setValue] = useState(copyFrom + "2");

  return (
    <Modal opened={opened} onClose={onClose} title="Copy" centered>
      <p>
        Copy From : {copyFrom}
      </p>
      <TextInput
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)} />
      <Button onClick={() => {
        onCopy(copyFrom, value);
        onClose();
      }}>
        Copy
      </Button>
    </Modal>
  )
}