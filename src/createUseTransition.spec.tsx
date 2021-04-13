import * as React from "react";
import { createUseTransition } from "./createUseTransition";
import { test, expect, beforeEach, jest } from "@jest/globals";
import { render, act } from "@testing-library/react";

const useTransition = createUseTransition(act);

let state: ReturnType<typeof render> | null = null;

beforeEach(() => {
  state?.unmount();
});

test("returns the current value for a non-loading object", () => {
  expect.assertions(2);
  const TestComponent = () => {
    const [isLoading, data] = useTransition({ hello: "hi" }, false);
    expect(isLoading).toEqual(false);
    expect(data).toEqual({ hello: "hi" });
    return null;
  };
  state = render(<TestComponent />);
});

test("returns the loading value for a loading object", () => {
  expect.assertions(2);
  const TestComponent = () => {
    const [isLoading, data] = useTransition({ hello: "hi" }, true);
    expect(isLoading).toEqual(true);
    expect(data).toEqual({ hello: "hi" });
    return null;
  };
  state = render(<TestComponent />);
});

test("returns the loading value for a loading object", () => {
  expect.assertions(2);
  const TestComponent = () => {
    const [isLoading, data] = useTransition({ hello: "hi" }, true);
    expect(isLoading).toEqual(true);
    expect(data).toEqual({ hello: "hi" });
    return null;
  };
  state = render(<TestComponent />);
});

test("returns the correct value after loading has finished", () => {
  expect.assertions(4);
  let renderCount = 0;
  const TestComponent = (state: {
    isLoading: boolean;
    data: string | null;
  }) => {
    renderCount = renderCount + 1;
    const [isLoading, data] = useTransition(state.data, state.isLoading);
    if (renderCount === 1) {
      expect(isLoading).toEqual(true);
      expect(data).toEqual(null);
    }
    if (renderCount === 2) {
      expect(isLoading).toEqual(false);
      expect(data).toEqual("foo");
    }
    return null;
  };
  state = render(<TestComponent isLoading={true} data={null} />);
  state.rerender(<TestComponent isLoading={false} data="foo" />);
});

test("updates isLoading to 'true' after threshold is reached after entering loading state", () => {
  jest.useFakeTimers();

  let renderCount = 0;
  const TestComponent = (state: {
    isLoading: boolean;
    data: string | null;
  }) => {
    renderCount = renderCount + 1;
    const [isLoading, data] = useTransition(state.data, state.isLoading);
    if (renderCount === 1) {
      expect(isLoading).toEqual(false);
      expect(data).toEqual("foo");
    }
    if (renderCount === 2) {
      expect(isLoading).toEqual(false);
      expect(data).toEqual("foo");
    }
    if (renderCount === 3) {
      expect(isLoading).toEqual(true);
      expect(data).toEqual("foo");
    }
    return null;
  };
  state = render(<TestComponent isLoading={false} data="foo" />);
  state.rerender(<TestComponent isLoading={true} data={null} />);
  jest.runAllTimers();
});

test("updates isLoading to 'false' and data to the latest value after leaving the loading state.", () => {
  jest.useFakeTimers();

  let renderCount = 0;
  const TestComponent = (state: {
    isLoading: boolean;
    data: string | null;
  }) => {
    renderCount = renderCount + 1;
    const [isLoading, data] = useTransition(state.data, state.isLoading);
    if (renderCount === 1) {
      expect(isLoading).toEqual(false);
      expect(data).toEqual("foo");
    }
    if (renderCount === 2) {
      expect(isLoading).toEqual(false);
      expect(data).toEqual("foo");
    }
    if (renderCount === 3) {
      expect(isLoading).toEqual(true);
      expect(data).toEqual("foo");
    }
    if (renderCount === 4) {
      expect(isLoading).toEqual(false);
      expect(data).toEqual("hi");
    }
    return null;
  };
  state = render(<TestComponent isLoading={false} data="foo" />);
  state.rerender(<TestComponent isLoading={true} data={null} />);
  jest.runAllTimers();
  state.rerender(<TestComponent isLoading={false} data={"hi"} />);
});
