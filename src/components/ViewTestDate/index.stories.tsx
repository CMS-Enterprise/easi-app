import React from 'react';
import { DateTime } from 'luxon';

import ViewTestDate from 'components/ViewTestDate/index';

const Template = (args: any) => (
  <div className="grid-col-4">
    <ViewTestDate {...args} />
  </div>
);

export default {
  title: 'View Test Date',
  component: ViewTestDate,
  parameters: {
    info: 'The View Test Date component'
  },
  args: {
    date: DateTime.local()
  }
};

export const Default = Template.bind({});
