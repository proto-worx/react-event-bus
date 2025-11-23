# react-event-bus

React hooks and context provider for `@protoworx/event-bus`.

## Installation

```bash
bun add @protoworx/react-event-bus @protoworx/event-bus
```

## Usage

### Setup

Wrap your application with the `EventBusProvider`:

```tsx
import { EventBusProvider } from "@protoworx/react-event-bus";

function App() {
  return (
    <EventBusProvider>
      {/* Your app components */}
    </EventBusProvider>
  );
}
```

### Subscribing to Events

Use the `useSubscribe` hook to listen to events:

```tsx
import { useSubscribe } from "@protoworx/react-event-bus";

function MyComponent() {
  useSubscribe("user:updated", (data) => {
    console.log("User updated:", data);
  });

  return <div>...</div>;
}
```

### Emitting Events

Use the `useEmit` hook to emit events:

```tsx
import { useEmit } from "@protoworx/react-event-bus";

function MyComponent() {
  const emit = useEmit();

  const handleClick = () => {
    emit("user:updated", { id: 1, name: "John" });
  };

  return <button onClick={handleClick}>Update User</button>;
}
```

### Accessing EventBus Directly

Use the `useEventBus` hook to access the EventBus instance directly:

```tsx
import { useEventBus } from "@protoworx/react-event-bus";

function MyComponent() {
  const eventBus = useEventBus();

  // Use eventBus methods directly
  eventBus.subscribe("custom:event", (data) => {
    // ...
  });
}
```

### TypeScript Support

Define your event mappings for type safety:

```tsx
type MyEventBus = {
  "user:updated": { id: number; name: string };
  "user:deleted": { id: number };
};

function MyComponent() {
  const emit = useEmit<MyEventBus>();
  
  emit("user:updated", { id: 1, name: "John" }); // ✅ Type-safe
  emit("user:updated", { wrong: "data" }); // ❌ Type error
}
```

## API

### `EventBusProvider`

Provider component that makes EventBus available to child components.

**Props:**
- `children`: ReactNode - Child components
- `eventBus?`: EventBus - Optional EventBus instance (creates new one if not provided)

### `useEventBus<TDefinedMappings>()`

Hook to access the EventBus instance from context.

**Returns:** EventBus instance

**Throws:** Error if used outside of EventBusProvider

### `useSubscribe<TDefinedMappings, TEvent>(event, listener, options?)`

Hook to subscribe to an event with automatic cleanup on unmount.

**Parameters:**
- `event`: The event name to subscribe to
- `listener`: Function to call when event is emitted
- `options?`: Optional configuration
  - `enabled?`: boolean - Whether subscription is enabled (default: true)

### `useEmit<TDefinedMappings>()`

Hook that returns a function to emit events.

**Returns:** Function to emit events `(event, data) => void`

## Development

To install dependencies:

```bash
bun install
```

To run tests:

```bash
bun test
```

To build:

```bash
bun run build
```

This project was created using `bun init` in bun v1.2.15. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

