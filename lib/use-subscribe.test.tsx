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
    expect(eventBus.get("listeners")).toStrictEqual(
      new Map([["test", new Set([mockListener])]])
    );
  });

  it("should subscribe to an event and emit the event", () => {
    const mockListener = mock(() => {});
    renderHook(() => useSubscribe<TestEventBus>("test", mockListener), {
      wrapper,
    });
    eventBus.emit("test", "test");
    expect(mockListener).toHaveBeenCalledWith("test");
  });

  it("should unsubscribe from an event", () => {
    const mockListener = mock(() => {});
    renderHook(() => useSubscribe<TestEventBus>("test", mockListener), {
      wrapper,
    });
    eventBus.unsubscribe("test", mockListener);
    expect(eventBus.get("listeners")).toStrictEqual(new Map());
  });
});
