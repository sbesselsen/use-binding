/* eslint-disable import/no-anonymous-default-export */
import { Story } from '@storybook/react';
import React from 'react';
import { useBinding } from '../index';

interface IUseBindingExample {
  controlledDefaultValue?: Date;
  controlledValue?: Date;
  onChange?: (date?: Date) => void;
}

const TestComponent = ({
  controlledDefaultValue,
  controlledValue,
  onChange
}: IUseBindingExample) => {
  const [selectedDate, setSelectedDate] = useBinding<Date | undefined>(
    controlledDefaultValue,
    controlledValue,
    onChange,
    undefined
  );
  return (
    <div className="use-binding">
      <p>Value: {selectedDate ? selectedDate.toISOString() : undefined}</p>
      <button onClick={() => setSelectedDate(new Date(2020, 1, 1))}>
        Change date
      </button>
    </div>
  );
};

export default {
  title: 'Test',
  argTypes: {
    activeId: { control: { type: 'text' } },
    loadingTransitionMs: { control: { type: 'number' } },
  },
  parameters: {
    controls: {
      exclude: [],
    },
  },
};

const Template: Story = () => (
  <TestComponent />
);

export const Test = Template.bind({});
Test.args = {}
