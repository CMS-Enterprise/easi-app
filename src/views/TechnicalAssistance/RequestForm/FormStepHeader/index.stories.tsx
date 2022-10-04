import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import FormStepHeader from '.';

export default {
  title: 'TRB Form Header',
  component: FormStepHeader,
  argTypes: {
    step: {
      type: 'number',
      control: 'inline-radio',
      options: [1, 2, 3, 4, 5]
    }
  }
} as ComponentMeta<typeof FormStepHeader>;

const Template: ComponentStory<typeof FormStepHeader> = (args: any) => (
  <MemoryRouter>
    <FormStepHeader {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  step: 2
};
