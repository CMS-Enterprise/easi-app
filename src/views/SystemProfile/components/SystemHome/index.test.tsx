import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import { getSystemProfileMockData } from 'data/mock/systemProfile';

import SystemHome from './index';

const systemProfileData = getSystemProfileMockData();

describe('SystemHome subpage for System Profile', () => {
  // skip due to parsed datetime difference in ci test
  it.skip('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <SystemHome system={systemProfileData} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
