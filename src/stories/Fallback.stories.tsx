/* eslint-disable import/no-anonymous-default-export */
import { Story } from '@storybook/react';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { useBinding } from '../index';

export default {
  title: 'Fallback',
  argTypes: {
    controlled: { control: { type: 'boolean' } },
    controlledValue: { control: { type: 'text' } },
    renderWithValueAction: { action: 'render with value'  },
    onChange: { action: 'onChange' },
  },
  parameters: {
    controls: {
      exclude: [],
    },
  },
};

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

export const Fallback: Story = () => {
  return (
    <React.Fragment>
      <CustomInput />
    </React.Fragment>
  );
}
