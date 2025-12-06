import { useCallback, useEffect, useRef } from "react";
import { useEventBus } from "./use-event-bus";

export const useDebouncedEmit = <
  TDefinedMappings extends { [key: string]: any }
>(delay: number = 300) => {
  const eventBus = useEventBus<TDefinedMappings>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingEventRef = useRef<{
    event: keyof TDefinedMappings;
    data: TDefinedMappings[keyof TDefinedMappings];
  } | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (
      event: keyof TDefinedMappings,
      data: TDefinedMappings[keyof TDefinedMappings]
    ) => {
      // Store the latest event and data
      pendingEventRef.current = { event, data };

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        if (pendingEventRef.current) {
          eventBus.emit(
            pendingEventRef.current.event,
            pendingEventRef.current.data
          );
          pendingEventRef.current = null;
        }
        timeoutRef.current = null;
      }, delay);
    },
    [eventBus, delay]
  );
};

