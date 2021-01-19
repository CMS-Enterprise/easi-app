import React from 'react';

import ActionBanner from './index';

const Template = (args: any) => <ActionBanner {...args} />;

export default {
  title: 'Action Banner',
  component: ActionBanner,
  parameters: {
    info:
      'The Action Banner component is used to let the user what actions they have pending.'
  },
  argTypes: {
    title: { control: 'text' },
    requestType: {
      control: {
        type: 'select',
        options: ['NEW', 'RECOMPETE', 'MAJOR_CHANGES', 'SHUTDOWN']
      }
    },
    helpfulText: { control: 'text' },
    label: { control: 'text' },
    buttonUnstyled: { control: 'boolean' },
    onClick: { control: 'boolean' }
  }
};

export const Default = Template.bind({});
Default.args = {
  title: 'Your Intake Request is submitted',
  requestType: 'NEW',
  helpfulText: 'The quick brown fox jumps over the lazy dog',
  label: 'Continue',
  buttonUnstyled: false,
  onClick: true
};
