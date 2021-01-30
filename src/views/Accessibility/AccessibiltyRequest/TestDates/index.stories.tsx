import React from 'react';

import TestDates from './index';

const Template = (args: any) => (
  <div className="grid-col-4">
    <TestDates {...args} />
  </div>
);

export default {
  title: 'Test Dates',
  component: TestDates,
  parameters: {
    info: 'The Test Dates component'
  }
};

export const Default = Template.bind({});
