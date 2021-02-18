import React from 'react';
import { DateTime } from 'luxon';

import TestDate from 'components/TestDate/index';

const Template = (args: any) => (
  <div className="grid-col-4">
    <TestDate {...args} />
  </div>
);

export default {
  title: 'Test Date',
  component: TestDate,
  parameters: {
    info: 'The Test Date component'
  },
  args: {
    date: DateTime.local()
  }
};

export const Default = Template.bind({});
