import { EventBus } from "@protoworx/event-bus";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import React from "react";
import { Provider } from "./event-bus-context";
import { useSubscribe } from "./use-subscribe";

let eventBus = new EventBus<TestEventBus>();

beforeEach(() => {
  eventBus = new EventBus<TestEventBus>();
});

type TestEventBus = {
  test: string;
  test2: string;
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider eventBus={eventBus}>{children}</Provider>
);
describe("useSubscribe", () => {
  it("should subscribe to an event", () => {
    const mockListener = mock(() => {});
    renderHook(() => useSubscribe<TestEventBus>("test", mockListener), {
      wrapper,
    });
    const listeners = eventBus.get("listeners")! as Map<
      keyof TestEventBus,
      Set<(event: string) => void>
    >;

    expect(listeners.has("test")).toBe(true);
    expect(listeners.get("test")?.size).toBe(1);
  });

  it("should subscribe to an event and emit the event", () => {
    const mockListener = mock(() => {});
    renderHook(() => useSubscribe<TestEventBus>("test", mockListener), {
      wrapper,
    });
    eventBus.emit("test", "test");
    expect(mockListener).toHaveBeenCalledWith("test");
  });

  it("should unsubscribe from an event on unmount", () => {
    const mockListener = mock(() => {});
    const { unmount } = renderHook(
      () => useSubscribe<TestEventBus>("test", mockListener),
      { wrapper }
    );
    unmount();

    const listeners = eventBus.get("listeners")! as Map<
      keyof TestEventBus,
      Set<(event: string) => void>
    >;
    expect(listeners.has("test")).toBe(false);
    expect(listeners.get("test")?.size).toBeUndefined();
  });

  it("should call updated listener after rerender", () => {
    const firstListener = mock(() => {});
    const secondListener = mock(() => {});
    const { rerender } = renderHook(
      ({ listener }) => useSubscribe<TestEventBus>("test", listener),
      { wrapper, initialProps: { listener: firstListener } }
    );
    rerender({ listener: secondListener });
    eventBus.emit("test", "data");
    expect(secondListener).toHaveBeenCalledWith("data");
  });
});
