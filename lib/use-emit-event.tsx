import { useEventBus } from "./use-event-bus";

export const useEmitEvent = <
  TDefinedMappings extends { [key: string]: any }
>() => {
  const eventBus = useEventBus<TDefinedMappings>();

  return (
    event: keyof TDefinedMappings,
    data: TDefinedMappings[keyof TDefinedMappings]
  ) => {
    eventBus.emit(event, data);
  };
};
