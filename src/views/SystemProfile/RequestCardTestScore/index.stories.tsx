import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import RequestStatusTag from '.';

export default {
  title: 'RequestStatusTag',
  component: RequestStatusTag
} as ComponentMeta<typeof RequestStatusTag>;

const Template: ComponentStory<typeof RequestStatusTag> = (args: any) => (
  <RequestStatusTag {...args} />
);

const date = '01/01/2022';

export const HundredPct = Template.bind({});
HundredPct.storyName = 'Score = 100%';
HundredPct.args = {
  scorePct: 100,
  date
};

export const LessThanHundredPct = Template.bind({});
LessThanHundredPct.storyName = 'Score < 100%';
LessThanHundredPct.args = {
  scorePct: 85,
  date
};
