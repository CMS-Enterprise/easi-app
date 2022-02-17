import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import {
  budgetsInfo,
  developmentTags,
  locationsInfo,
  mockSystemInfo
} from 'views/Sandbox/mockSystemData';

import FundingAndBudget from './index';

describe('The making a request page', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={['/systems/326-9-0/funding-and-budget']}>
        <Route path="/systems/:systemId/:subinfo">
          <FundingAndBudget
            system={{
              ...mockSystemInfo[3],
              locations: locationsInfo,
              developmentTags,
              budgets: budgetsInfo
            }}
          />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('HAM Project funding')).toBeInTheDocument();
      expect(screen.getByText('Geraldine Hobbs')).toBeInTheDocument();
      expect(screen.getByText('Fed Admin')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/systems/326-9-0/details']}>
        <Route path="/systems/:systemId/:subinfo">
          <FundingAndBudget
            system={{
              ...mockSystemInfo[3],
              ...locationsInfo,
              ...developmentTags
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
