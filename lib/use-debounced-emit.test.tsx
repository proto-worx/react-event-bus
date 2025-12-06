import { EventBus } from "@protoworx/event-bus";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import React from "react";
import { Provider } from "./event-bus-context";
import { useDebouncedEmit } from "./use-debounced-emit";

type TestEventBus = {
  test: string;
  test2: string;
};

let eventBus = new EventBus<TestEventBus>();

const mockListener = mock(() => {});
beforeEach(() => {
  eventBus = new EventBus<TestEventBus>();
  eventBus.subscribe("test", mockListener);
  mockListener.mockClear();
});

afterEach(() => {
  mockListener.mockClear();
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider eventBus={eventBus}>{children}</Provider>
);

describe("useDebouncedEmit", () => {
  it("should debounce emissions", async () => {
    const { result } = renderHook(() => useDebouncedEmit<TestEventBus>(100), {
      wrapper,
    });

    // Call multiple times rapidly
    result.current("test", "first");
    result.current("test", "second");
    result.current("test", "third");

    // Should not have been called yet
    expect(mockListener).not.toHaveBeenCalled();

    // Wait for debounce delay
    await waitFor(
      () => {
        expect(mockListener).toHaveBeenCalledTimes(1);
      },
      { timeout: 200 }
    );

    // Should only have been called with the last value
    expect(mockListener).toHaveBeenCalledWith("third");
  });

  it("should use default delay of 300ms", async () => {
    const { result } = renderHook(() => useDebouncedEmit<TestEventBus>(), {
      wrapper,
    });

    result.current("test", "test");

    // Should not have been called immediately
    expect(mockListener).not.toHaveBeenCalled();

    // Wait for default delay
    await waitFor(
      () => {
        expect(mockListener).toHaveBeenCalledTimes(1);
      },
      { timeout: 400 }
    );

    expect(mockListener).toHaveBeenCalledWith("test");
  });

  it("should reset timeout on new calls", async () => {
    const { result } = renderHook(() => useDebouncedEmit<TestEventBus>(100), {
      wrapper,
    });

    result.current("test", "first");

    // Wait a bit but not enough for debounce
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Call again, should reset the timer
    result.current("test", "second");

    // Wait for debounce delay from second call
    await waitFor(
      () => {
        expect(mockListener).toHaveBeenCalledTimes(1);
      },
      { timeout: 200 }
    );

    // Should only have been called with the last value
    expect(mockListener).toHaveBeenCalledWith("second");
  });

  it("should clean up timeout on unmount", async () => {
    const { result, unmount } = renderHook(
      () => useDebouncedEmit<TestEventBus>(100),
      {
        wrapper,
      }
    );

    result.current("test", "test");

    // Unmount before delay completes
    unmount();

    // Wait for the delay that would have triggered
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Should not have been called because component unmounted
    expect(mockListener).not.toHaveBeenCalled();
  });
});

