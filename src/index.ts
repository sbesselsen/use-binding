import { Dispatch, useCallback, useRef, useState } from 'react';

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
    defaultValue: T | undefined | null,
    value: T | undefined | null,
    onChange: ChangeHandler<T> | undefined | null,
    fallbackValue: T,
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
    value: T | undefined | null,
    onChange: ChangeHandler<T> | undefined | null,
): [T, Setter<T>];

/**
 * Return a [value, setValue] pair for a binding.
 *
 * @param defaultValue
 * @param value
 * @param onChange
 */
export function useBinding<T>(
    defaultValue: T | undefined | null,
    value: T,
    onChange: ChangeHandler<T> | undefined | null,
): [T, Setter<T>];

/**
 * Return a [value, setValue] pair for a binding.
 *
 * @param defaultValue
 * @param value
 * @param onChange
 */
export function useBinding<T>(
    defaultValue: T | undefined | null,
    value: T | undefined | null,
    onChange: ChangeHandler<T> | undefined | null,
): [T | null, Setter<T, T | null>];

export function useBinding<T>(
    defaultValue: T | undefined | null,
    value: T | undefined | null,
    onChange: ChangeHandler<T> | undefined | null,
    fallbackValue?: T,
): [T | null, Setter<T, T | null>] {
    let hasControlledValue = true;
    let inputValue: T | null = null;
    if (isNotEmpty(value)) {
        inputValue = value;
    } else if (isNotEmpty(defaultValue)) {
        hasControlledValue = false;
        inputValue = defaultValue;
    } else if (isNotEmpty(fallbackValue)) {
        inputValue = fallbackValue;
    }
    const [uncontrolledValue, setUncontrolledValue] = useState(inputValue);
    const changeHandler = onChange || noop;
    const currentValueRef = useRef<T | null>(null);
    currentValueRef.current = hasControlledValue ? inputValue : uncontrolledValue;
    const setter = useCallback((newValue: SetBindingStateAction<T, T | null>) => {
        const evaluatedNewValue = typeof newValue === 'function'
        ? (newValue as ((prevState: T | null) => T))(currentValueRef.current)
        : newValue;
        currentValueRef.current = evaluatedNewValue;
        changeHandler(evaluatedNewValue);
        if (!hasControlledValue) {
            setUncontrolledValue(evaluatedNewValue);
        }
    }, [currentValueRef, changeHandler, hasControlledValue]);
    return [currentValueRef.current, setter];
}

function noop<T>(_: T) {
    // Nothing.
}

function isNotEmpty<T>(value: T | undefined | null): value is T {
    return typeof value !== 'undefined' && value !== null;
}
