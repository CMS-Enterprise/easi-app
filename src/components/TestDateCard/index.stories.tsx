import React from 'react';
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
  parameters: {
    info: 'The Test Date Card component'
  },
  args: {
    date: DateTime.local()
  }
};

export const Default = Template.bind({});
