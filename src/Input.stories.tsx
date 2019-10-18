import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import React, { ChangeEvent, useCallback, useState } from 'react';
import { useBinding } from './index';

const controlledStories = storiesOf('Input|Controlled', module);
const uncontrolledStories = storiesOf('Input|Uncontrolled', module);
const fallbackStories = storiesOf('Input|Fallback', module);

interface IInputProps {
    defaultValue?: string;
    value?: string;
    onChange?: (newValue: string) => void;
}

const CustomInput: React.FC<IInputProps> = ({ defaultValue, value, onChange }) => {
    const [inputValue, setInputValue] = useBinding(defaultValue, value, onChange, 'fallback');
    const onChangeCallback = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }, [setInputValue]);
    return (
        <input type="text" value={inputValue} onChange={onChangeCallback} />
    );
};

const renderWithValueAction = action('render with value');
const onChangeAction = action('onChange');

controlledStories.add('Mutable', () => {
    const [value, setValue] = useState('');
    renderWithValueAction(value);
    return (
        <React.Fragment>
            <CustomInput value={value} onChange={setValue} />
        </React.Fragment>
    );
 });

controlledStories.add('Static value', () => {
    return (
        <React.Fragment>
            <CustomInput value="the value" />
        </React.Fragment>
    );
 });

uncontrolledStories.add('Default value', () => {
    return (
        <React.Fragment>
            <CustomInput defaultValue="default value" onChange={onChangeAction} />
        </React.Fragment>
    );
 });

uncontrolledStories.add('No onChange', () => {
    return (
        <React.Fragment>
            <CustomInput defaultValue="default value" />
        </React.Fragment>
    );
 });

uncontrolledStories.add('Switch between controlled and uncontrolled', () => {
    const controlledValue = text('Controlled value', '');
    return (
        <React.Fragment>
            <CustomInput
                defaultValue="default value"
                value={boolean('Controlled', false) ? controlledValue : undefined}
                onChange={onChangeAction}
            />
        </React.Fragment>
    );
 });

fallbackStories.add('Fallback value', () => {
    return (
        <React.Fragment>
            <CustomInput />
        </React.Fragment>
    );
 });
