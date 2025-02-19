import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { getMockSystemProfileData } from 'tests/mock/systemProfile';

import SystemHome from './index';

const systemProfileData = getMockSystemProfileData();

describe('SystemHome subpage for System Profile', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <SystemHome system={systemProfileData} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
