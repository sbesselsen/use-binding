# useBinding
Controlled and uncontrolled two-way property binding for React

## Installation
`npm install use-binding`

## Why?
When developing React components, you often have to choose between providing a controlled (or "stateless") or uncontrolled ("stateful") version. For instance, if you have a custom Input component, do you:

* Provide a `defaultValue` prop and manage the state inside your component (uncontrolled), or do you:
* Provide a `value` prop and expect the parent component to manage state for you (controlled)?

You may end up developing both variants, adding lots of boilerplate code.

`useBinding` allows you to do both in one line.

## Example
Consider the `Input` example above. This is how you would use `useBinding`:

```tsx
import React, { useCallback } from 'react';
import { useBinding } from 'use-binding';

interface IInputProps {
    defaultValue?: string
    value?: string
    onChange?: (newValue: string) => void
}

const CustomInput: React.FC<IInputProps> = ({ defaultValue, value, onChange }) => {
    const [inputValue, setInputValue] = useBinding(defaultValue, value, onChange, '');
    const onChangeCallback = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }, [setInputValue]);
    return (
        <input type="text" value={inputValue} onChange={onChangeCallback} />
    );
};
```

Now consumers of your `CustomInput` component can do any of these:

```tsx
// Controlled:
const [value, setValue] = useState('');
<CustomInput value={value} onChange={setValue} />;

// Uncontrolled:
<CustomInput defaultValue="my default" onChange={(newValue: string) => { console.log(newValue); })} />;

// Fixed value:
<CustomInput value="can't change me" />;
```

## Usage

Use this in your component:

```ts
const [myValue, setMyValue] = useBinding(
    defaultValue,
    value,
    onChange,
    fallbackValue
);
```

Now use `myValue` as your property value, and use `setMyValue` whenever you want to change it.

If the consumer of your component passes a `value`, that value will always be used.

If the consumer of your component passes a `defaultValue`, then `useBinding` will use `useState` internally to keep track of the current value. That's where `useBinding` makes your life a lot easier.

If both `defaultValue` and `value` are empty, then the `fallbackValue` will be used. The `fallbackValue` is optional: if you don't provide it either, then `myValue` will be null.

If the consumer of your component passed an `onChange` handler, that handler will be called when using `setMyValue`.


## Typescript
`useBinding` supports Typescript and contains generic typings.

## Developer

Developed by [Sebastiaan Besselsen](https://github.com/sbesselsen) at [Sdu Uitgevers](https://www.sdu.nl), The Netherlands.
