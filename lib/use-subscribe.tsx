import { useEffect, useRef } from "react";
import { useEventBus } from "./use-event-bus";

export const useSubscribe = <TDefinedMappings extends { [key: string]: any }>(
  event: keyof TDefinedMappings,
  listener: (data: TDefinedMappings[keyof TDefinedMappings]) => void
) => {
  const eventBus = useEventBus<TDefinedMappings>();
  const listenerRef = useRef(listener);
  
  // Keep the listener ref up to date
  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);
  
  useEffect(() => {
    // Create a stable wrapper function
    const stableListener = (data: TDefinedMappings[keyof TDefinedMappings]) => {
      listenerRef.current(data);
    };
    
    eventBus.subscribe(event, stableListener);
    
    return () => {
      eventBus.unsubscribe(event, stableListener);
    };
  }, [eventBus, event]); // Only depend on eventBus and event
};
