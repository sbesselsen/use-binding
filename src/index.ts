import { useState } from 'react';

type ChangeHandler<T> = (newValue: T) => void;

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
): [T, ChangeHandler<T>];

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
): [T, ChangeHandler<T>];

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
): [T, ChangeHandler<T>];

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
): [T | null, ChangeHandler<T>];

export function useBinding<T>(
    defaultValue: T | undefined | null,
    value: T | undefined | null,
    onChange: ChangeHandler<T> | undefined | null,
    fallbackValue?: T,
): [T | null, ChangeHandler<T>] {
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
    if (hasControlledValue) {
        return [inputValue, changeHandler];
    }
    return [
        uncontrolledValue,
        (newValue: T) => {
            changeHandler(newValue);
            setUncontrolledValue(newValue);
        },
    ];
}

function noop<T>(_: T) {
    // Nothing.
}

function isNotEmpty<T>(value: T | undefined | null): value is T {
    return typeof value !== 'undefined' && value !== null;
}
