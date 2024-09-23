import { useAppSelector } from "../hook"
import PathTable from "./PathTable";

export default function PathView({pathName}: {
  pathName: string
}) {
  const data = useAppSelector((state) => state.pathMutexInfoStore[pathName]);

  return (
    <>
      <PathTable pathMutexInfo={data} />
    </>
  )
}