import { useContext } from "react";
import { listContext } from "../contexts/listContext";

export function useList() {
  const context = useContext(listContext);

  if (!context) {
    throw new Error("useList must be used within a ListProvider");
  }

  return context;
}
