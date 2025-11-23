import { EventBus } from "@protoworx/event-bus";
import { beforeEach, mock } from "bun:test";
import React from "react";
import { Provider } from "./event-bus-context";

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
