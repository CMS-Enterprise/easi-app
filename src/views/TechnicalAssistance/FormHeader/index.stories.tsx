import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import FormHeader from '.';

export default {
  title: 'TRB Form Header',
  component: FormHeader,
  argTypes: {
    step: {
      type: 'number',
      control: 'inline-radio',
      options: [1, 2, 3, 4, 5]
    }
  }
} as ComponentMeta<typeof FormHeader>;

const Template: ComponentStory<typeof FormHeader> = (args: any) => (
  <MemoryRouter>
    <FormHeader {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  step: 2,
  breadcrumbItems: [
    { text: 'Technical Assistance', url: '#/trb' },
    { text: 'Task list', url: '#/trb/tasklist' },
    { text: 'TRB Request', url: '#/trb/new' }
  ]
};
