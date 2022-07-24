import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import { getMockSystemProfileData } from 'data/mock/systemProfile';

import SystemData from './index';

const systemProfileData = getMockSystemProfileData();

describe('System Data sub page for System Profile', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/system-data']}>
        <Route path="/systems/:systemId/:subinfo">
          <SystemData system={systemProfileData} />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
