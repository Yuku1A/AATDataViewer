import { createContext, ReactNode } from "react";

export const CreateWindowContext = createContext((
  jsx: ReactNode, title: string, height: number, width: number) => {}
);