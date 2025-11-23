import { useEventBus } from "./use-event-bus";

export const useSubscribe = <TDefinedMappings extends { [key: string]: any }>(
  event: keyof TDefinedMappings,
  listener: (data: TDefinedMappings[keyof TDefinedMappings]) => void
) => {
  const eventBus = useEventBus<TDefinedMappings>();
  eventBus.subscribe(event, listener);
};
