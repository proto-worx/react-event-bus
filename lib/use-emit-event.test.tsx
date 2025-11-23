import { EventBus } from "@protoworx/event-bus";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import React from "react";
import { Provider } from "./event-bus-context";
import { useEmitEvent } from "./use-emit-event";

type TestEventBus = {
  test: string;
  test2: string;
};

let eventBus = new EventBus<TestEventBus>();

const mockListener = mock(() => {});
beforeEach(() => {
  eventBus = new EventBus<TestEventBus>();
  eventBus.subscribe("test", mockListener);
  eventBus.subscribe("test", mockListener);
});

afterEach(() => {
  mockListener.mockClear();
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider eventBus={eventBus}>{children}</Provider>
);

describe("useEmitEvent", () => {
  it("should emit an event", () => {
    const { result } = renderHook(() => useEmitEvent<TestEventBus>(), {
      wrapper,
    });

    result.current("test", "test");
    expect(mockListener).toHaveBeenCalledTimes(1);
    expect(mockListener).toHaveBeenCalledWith("test");
  });
});
