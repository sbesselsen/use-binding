/* eslint-disable import/no-anonymous-default-export */
import { Story } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { useBinding } from '../index';

export default {
  title: 'Mutator',
  argTypes: {
    isControlled: { control: { type: 'boolean' } },
    onChange: { action: 'onChange' },
  },
  parameters: {
    controls: {
      exclude: [],
    },
  },
};

interface IMutatorExampleProps {
  defaultValue?: number;
  value?: number;
  onChange?: (newValue: number) => void;
}

const MutatorExample: React.FC<IMutatorExampleProps> = ({ defaultValue, value, onChange }) => {
  const [counter, setCounter] = useBinding(defaultValue, value, onChange, 0);
  const onClick = useCallback(() => {
    for (let i = 0; i < 10; i++) {
      setCounter((x) => x + 1);
    }
  }, [setCounter]);
  return (
    <React.Fragment>
      {counter} <button onClick={onClick}>Increment by 10</button>
    </React.Fragment>
  );
};

export const Mutator: Story = ({ onChange, isControlled }) => {
  const [counter, setCounter] = useState(0);
  const setCounterWithLogging = useCallback((x: number) => {
    onChange(x);
    if (isControlled) {
      setCounter(x);
    }
  }, [onChange, isControlled]);

  return (
    <React.Fragment>
      <MutatorExample
        defaultValue={0}
        value={isControlled ? counter : undefined}
        onChange={setCounterWithLogging}
      />
    </React.Fragment>
  );
}

