import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ComponentMeta } from '@storybook/react';

import RequestEdits from './RequestEdits';

export default {
  title: 'Request Edits',
  component: RequestEdits
} as ComponentMeta<typeof RequestEdits>;

export const Default = () => (
  <MemoryRouter initialEntries={['/']}>
    <RequestEdits />
  </MemoryRouter>
);
