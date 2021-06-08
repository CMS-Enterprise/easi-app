import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Meta } from '@storybook/react';
import { DateTime } from 'luxon';

import TestDateCard from 'components/TestDateCard';

const Template = (args: any) => (
  <div className="grid-col-4">
    <TestDateCard {...args} />
  </div>
);

export default {
  title: 'Test Date Card',
  component: TestDateCard,
  decorators: [
    Story => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    )
  ],
  parameters: {
    info: 'The Test Date Card component'
  },
  args: {
    testDate: {
      date: DateTime.local()
    }
  }
} as Meta;

export const Default = Template.bind({});
