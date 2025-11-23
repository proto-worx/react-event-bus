import { EventBus } from "@protoworx/event-bus";
import React, { createContext, useRef } from "react";

export const EventBusContext = createContext<EventBus<any> | null>(null);

export const Provider = ({
  children,
  eventBus,
}: React.PropsWithChildren<{ eventBus?: EventBus<any> }>) => {
  if (!eventBus) {
    throw new Error("eventBus is required");
  }
  const ref = useRef<EventBus<any>>(eventBus);

  return (
    <EventBusContext.Provider value={ref.current}>
      {children}
    </EventBusContext.Provider>
  );
};
