import { EventBus } from "@protoworx/event-bus";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import React from "react";
import { Provider } from "./event-bus-context";
import { useUnsubscribe } from "./use-unsubscribe";

type TestEventBus = {
  test: string;
  test2: string;
};

let eventBus = new EventBus<TestEventBus>();

beforeEach(() => {
  eventBus = new EventBus<TestEventBus>();
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider eventBus={eventBus}>{children}</Provider>
);

describe("useUnsubscribe", () => {
  it("should unsubscribe from an event", () => {
    const mockListener = mock(() => {});
    eventBus.subscribe("test", mockListener);

    const { result } = renderHook(() => useUnsubscribe<TestEventBus>(), {
      wrapper,
    });

    result.current("test", mockListener);
    expect(eventBus.get("listeners")).toStrictEqual(new Map());
  });
});
