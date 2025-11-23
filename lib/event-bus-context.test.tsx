import { EventBus } from "@protoworx/event-bus";
import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import React from "react";
import { EventBusContext, Provider } from "./event-bus-context";

describe("EventBusContext", () => {
  it("should be defined", () => {
    expect(EventBusContext).toBeDefined();
  });

  it("should render children", () => {
    const { getByText } = render(
      <Provider eventBus={new EventBus()}>
        <div>Hello, world!</div>
      </Provider>
    );

    const title = getByText("Hello, world!");
    expect(title).toBeInTheDocument();
  });

  it("should throw an error if no event bus is provided", () => {
    const originalError = console.error;
    console.error = () => {}; // Suppress React error boundary warning

    expect(() => {
      render(
        <Provider>
          <div>Hello, world!</div>
        </Provider>
      );
    }).toThrow("eventBus is required");

    console.error = originalError; // Restore console.error
  });
});
