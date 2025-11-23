import { useEventBus } from "./use-event-bus";

export const useUnsubscribe = <
  TDefinedMappings extends { [key: string]: any }
>() => {
  const eventBus = useEventBus<TDefinedMappings>();

  return (
    event: keyof TDefinedMappings,
    listener: (data: TDefinedMappings[keyof TDefinedMappings]) => void
  ) => eventBus.unsubscribe(event, listener);
};
