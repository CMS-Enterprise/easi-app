import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import { getMockSystemProfileData } from 'data/mock/systemProfile';

import SystemHome from './index';

const systemProfileData = getMockSystemProfileData();

describe('SystemHome subpage for System Profile', () => {
  it('matches snapshot', async () => {
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
