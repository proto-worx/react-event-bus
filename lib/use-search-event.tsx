import { useEventBus } from "./use-event-bus";

type AutoCompleteEvent<T> = T | (string & {});

export const useSearchEvent = <
  TDefinedMappings extends { [key: string]: any }
>() => {
  const eventBus = useEventBus<TDefinedMappings>();

  return (event: AutoCompleteEvent<keyof TDefinedMappings>) => {
    return eventBus.search(event as string);
  };
};
