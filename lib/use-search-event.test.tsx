import { EventBus } from "@protoworx/event-bus";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import React from "react";
import { Provider } from "./event-bus-context";
import { useSearchEvent } from "./use-search-event";

type TestEventBus = {
  test: string;
  test2: string;
};

let eventBus = new EventBus<TestEventBus>();

beforeEach(() => {
  eventBus = new EventBus<TestEventBus>();
  eventBus.subscribe(
    "test",
    mock(() => {})
  );
  eventBus.subscribe(
    "test2",
    mock(() => {})
  );
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider eventBus={eventBus}>{children}</Provider>
);

describe("useSearchEvent", () => {
  it("should return the event bus", () => {
    const { result } = renderHook(() => useSearchEvent<TestEventBus>(), {
      wrapper,
    });
    expect(result.current).toBeDefined();
    expect(result.current).toMatchInlineSnapshot(`[Function]`);
  });

  it("should search for an event by name", () => {
    const {
      result: { current: searchEvent },
    } = renderHook(() => useSearchEvent<TestEventBus>(), {
      wrapper,
    });

    const result = searchEvent("test2");
    expect(result).toStrictEqual([["test2", new Set([mock(() => {})])]]);
  });
});
