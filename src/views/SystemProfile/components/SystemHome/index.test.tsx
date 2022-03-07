import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import {
  activities,
  budgetsInfo,
  developmentTags,
  locationsInfo,
  mockSystemInfo,
  products,
  subSystems,
  systemData
} from 'views/Sandbox/mockSystemData';

import SystemHome from './index';

describe('The making a request page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/systems/326-9-0/details']}>
        <Route path="/systems/:systemId/:subinfo">
          <SystemHome
            system={{
              ...mockSystemInfo[3],
              locations: locationsInfo,
              developmentTags,
              budgets: budgetsInfo,
              subSystems,
              activities,
              atoStatus: 'In Progress',
              products,
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
