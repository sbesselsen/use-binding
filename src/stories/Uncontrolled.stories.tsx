/* eslint-disable import/no-anonymous-default-export */
import { Story } from '@storybook/react';
import React, { ChangeEvent, useCallback } from 'react';
import { useBinding } from '../index';

export default {
  title: 'Uncontrolled',
  argTypes: {
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

export const DefaultValue: Story = ({ onChange }) => {
  return (
    <React.Fragment>
      <CustomInput defaultValue="default value" onChange={onChange} />
    </React.Fragment>
  );
}

export const NoOnChange: Story = () => {
  return (
    <React.Fragment>
      <CustomInput defaultValue="default value" />
    </React.Fragment>
  );
}
