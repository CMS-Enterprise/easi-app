import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import { mockSystemInfo, systemData } from 'views/Sandbox/mockSystemData';

import SystemData from './index';

describe('System Data sub page for System Profile', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/system-profile/326-9-0/system-data']}>
        <Route path="/system-profile/:systemId/:subinfo">
          <SystemData
            system={{
              ...mockSystemInfo[3],
              systemData
            }}
          />
        </Route>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
