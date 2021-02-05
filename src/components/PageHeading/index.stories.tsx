import React from 'react';
import {
  ArgsTable,
  Description,
  Primary,
  PRIMARY_STORY,
  Subtitle,
  Title
} from '@storybook/addon-docs/blocks';

import PageHeading from './index';

export default {
  title: 'Page Heading',
  component: PageHeading,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

export const Default = () => <PageHeading>Test Page Heading</PageHeading>;
