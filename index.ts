export { EventBusProvider, EventBusContext } from "./lib/event-bus-context";
export { useEventBus } from "./lib/use-event-bus";
export { useSubscribe } from "./lib/use-subscribe";
export { useEmit } from "./lib/use-emit";
export type {
  EventBusContextValue,
  UseEventBusReturn,
  UseSubscribeOptions,
  UseEmitReturn,
} from "./lib/react-event-bus.types";

// Re-export types from @protoworx/event-bus
export type {
  EventBusEvent,
  EventBusListener,
  EventBusSubscribeFunction,
  EventBusUnsubscribeFunction,
  EventBusEmitFunction,
} from "@protoworx/event-bus";

// Re-export EventBus class for convenience
export { EventBus } from "@protoworx/event-bus";

