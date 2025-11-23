import { EventBus } from "@protoworx/event-bus";
import { useContext } from "react";
import { EventBusContext } from "./event-bus-context";

export const useEventBus = <T extends { [key: string]: any }>() => {
  const context = useContext(EventBusContext) as EventBus<T> | undefined;
  if (!context)
    throw new Error("useEventBus must be used within a EventBusProvider");

  return context;
};
