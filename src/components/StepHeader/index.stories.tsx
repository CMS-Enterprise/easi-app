import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Icon } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';

import StepHeader from '.';

export default {
  title: 'Step Header',
  component: StepHeader,
  argTypes: {
    step: {
      type: 'number',
      control: 'inline-radio',
      options: [1, 2, 3, 4, 5]
    }
  }
} as ComponentMeta<typeof StepHeader>;

const Template: ComponentStory<typeof StepHeader> = (args: any) => (
  <MemoryRouter>
    <StepHeader {...args} />
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {
  heading: 'TRB Request',
  text: 'Tell the Technical Review Board (TRB) what type of technical support you need. The information you provide on this form helps the TRB understand context around your request in order to offer more targeted help.',
  subText:
    'After submitting this form, you will receive an automatic email from the TRB mailbox, and an TRB team member will reach out regarding next steps.',
  step: 2,
  steps: [
    {
      key: 'Basic request details',
      label: (
        <>
          <span className="name">Basic</span>
          <span className="long">Basic request details</span>
        </>
      ),
      onClick: () => {
        // eslint-disable-next-line no-alert
        alert('Basic');
      }
    },
    {
      key: 'Subject areas',
      label: 'Subject areas',
      description: 'Select any and all'
    },
    {
      key: 'Attendees',
      label: 'Attendees',
      description:
        'As the primary requester, please add your CMS component and role on the project. You may also add the names and contact information for any additional individuals who should be present at the IT Tech Lounge or other meetings.'
    },
    {
      key: 'Supporting documents',
      label: 'Supporting documents',
      description:
        'Upload any documents relevant to your request. This could include documents such as presentation slide decks, concept papers, architecture diagrams, or other system information documents.'
    },
    { key: 'Check and submit', label: 'Check and submit' }
  ],
  breadcrumbBar: (
    <Breadcrumbs
      items={[
        { text: 'Foo', url: '#foo' },
        { text: 'Bar', url: '#bar' },
        { text: 'Baz' }
      ]}
    />
  ),
  children: (
    <UswdsReactLink to="#save">
      <Icon.ArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
      Save and exit
    </UswdsReactLink>
  )
};
