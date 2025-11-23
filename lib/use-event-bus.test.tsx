import { EventBus } from "@protoworx/event-bus";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import React from "react";
import { Provider } from "./event-bus-context";
import { useEventBus } from "./use-event-bus";

let eventBus = new EventBus<TestEventBus>();

beforeEach(() => {
  eventBus = new EventBus<TestEventBus>();
});
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider eventBus={eventBus}>{children}</Provider>
);

type TestEventBus = {
  test: string;
  test2: string;
};

describe("useEventBus", () => {
  it("should return the event bus", () => {
    const { result } = renderHook(() => useEventBus<TestEventBus>(), {
      wrapper,
    });
    expect(result.current).toBeDefined();
    expect(result.current).toBeInstanceOf(EventBus);
  });

  it("should subscribe to an event", () => {
    const { result } = renderHook(() => useEventBus<TestEventBus>(), {
      wrapper,
    });

    const mockListener = mock(() => {});
    result.current.subscribe("test", mockListener);
    expect(result.current.get("listeners")).toStrictEqual(
      new Map([["test", new Set([mockListener])]])
    );
  });

  it("should unsubscribe from an event", () => {
    const { result } = renderHook(() => useEventBus<TestEventBus>(), {
      wrapper,
    });
    const mockListener = mock(() => {});
    result.current.subscribe("test", mockListener);
    result.current.unsubscribe("test", mockListener);
    expect(result.current.get("listeners")).toStrictEqual(new Map());
  });

  it("should emit an event to all listeners", () => {
    const { result } = renderHook(() => useEventBus<TestEventBus>(), {
      wrapper,
    });
    const mockListener = mock(() => {});
    result.current.subscribe("test", mockListener);
    result.current.emit("test", "test");
    expect(mockListener).toHaveBeenCalledWith("test");
  });

  it("should not emit an event to listeners that are not subscribed to the event", () => {
    const { result } = renderHook(() => useEventBus<TestEventBus>(), {
      wrapper,
    });
    const mockListener = mock(() => {});
    const mockListener2 = mock(() => {});
    result.current.subscribe("test2", mockListener2);
    result.current.subscribe("test", mockListener);
    result.current.emit("test", "test");
    expect(mockListener).toHaveBeenCalledWith("test");
    expect(mockListener2).not.toHaveBeenCalled();
  });

  it("should not emit an event that has been unsubscribed", () => {
    const { result } = renderHook(() => useEventBus<TestEventBus>(), {
      wrapper,
    });
    const mockListener = mock(() => {});
    result.current.subscribe("test", mockListener);
    result.current.unsubscribe("test", mockListener);
    result.current.emit("test", "test");
    expect(mockListener).not.toHaveBeenCalled();
  });

  it("should unsubscribe from all events", () => {
    const { result } = renderHook(() => useEventBus<TestEventBus>(), {
      wrapper,
    });
    const mockListener = mock(() => {});
    result.current.subscribe("test", mockListener);
    result.current.subscribe("test2", mockListener);
    result.current.unsubscribeAll();
    expect(result.current.get("listeners")).toStrictEqual(new Map());
  });
});
