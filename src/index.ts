import { Dispatch, useCallback, useRef, useState } from "react";

type SetBindingStateAction<S, I> = S | ((prevState: I) => S);
type ChangeHandler<T> = (newValue: T) => void;
type Setter<T, I = T> = Dispatch<SetBindingStateAction<T, I>>;

/**
 * Return a [value, setValue] pair for a binding.
 *
 * By providing a fallbackValue, you guarantee that the output value is never null.
 *
 * @param defaultValue
 * @param value
 * @param onChange
 * @param fallbackValue
 */
export function useBinding<T>(
  defaultValue: T | undefined,
  value: T | undefined,
  onChange: ChangeHandler<T> | undefined,
  fallbackValue: T
): [T, Setter<T>];

/**
 * Return a [value, setValue] pair for a binding.
 *
 * @param defaultValue
 * @param value
 * @param onChange
 */
export function useBinding<T>(
  defaultValue: T,
  value: T | undefined,
  onChange: ChangeHandler<T> | undefined
): [T, Setter<T>];

/**
 * Return a [value, setValue] pair for a binding.
 *
 * @param defaultValue
 * @param value
 * @param onChange
 */
export function useBinding<T>(
  defaultValue: T | undefined,
  value: T,
  onChange: ChangeHandler<T> | undefined
): [T, Setter<T>];

/**
 * Return a [value, setValue] pair for a binding.
 *
 * @param defaultValue
 * @param value
 * @param onChange
 */
export function useBinding<T>(
  defaultValue: T | undefined,
  value: T | undefined,
  onChange: ChangeHandler<T> | undefined
): [T | undefined, Setter<T, T | undefined>];

export function useBinding<T>(
  defaultValue: T | undefined,
  value: T | undefined,
  onChange: ChangeHandler<T> | undefined,
  fallbackValue?: T
): [T | undefined, Setter<T, T | undefined>] {
  let hasControlledValue = false;
  let inputValue: T | undefined;
  if (isDefined(value)) {
    hasControlledValue = true;
    inputValue = value;
  } else if (isDefined(defaultValue)) {
    inputValue = defaultValue;
  } else if (isDefined(fallbackValue)) {
    inputValue = fallbackValue;
  }
  const controlledValueRef = useRef(hasControlledValue);
  if (controlledValueRef.current !== hasControlledValue) {
    console.warn(
      `WARN: A component changed from ${
        controlledValueRef.current ? "controlled" : "uncontrolled"
      } to ${hasControlledValue ? "controlled" : "uncontrolled"}.`
    );
    controlledValueRef.current = hasControlledValue;
  }
  const [uncontrolledValue, setUncontrolledValue] = useState(inputValue);
  const changeHandler = onChange || noop;
  const currentValueRef = useRef<T | undefined>();
  currentValueRef.current = hasControlledValue ? inputValue : uncontrolledValue;
  const setter = useCallback(
    (newValue: SetBindingStateAction<T, T | undefined>) => {
      const evaluatedNewValue =
        typeof newValue === "function"
          ? (newValue as (prevState: T | undefined) => T)(
              currentValueRef.current
            )
          : newValue;
      currentValueRef.current = evaluatedNewValue;
      changeHandler(evaluatedNewValue);
      if (!hasControlledValue) {
        setUncontrolledValue(evaluatedNewValue);
      }
    },
    [currentValueRef, changeHandler, hasControlledValue]
  );
  return [currentValueRef.current, setter];
}

function noop<T>(_: T) {
  // Nothing.
}

function isDefined<T>(value: T | undefined): value is T {
  return typeof value !== "undefined";
}
