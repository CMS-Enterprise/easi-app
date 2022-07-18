import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import { getMockSystemProfileData } from 'data/mock/systemProfile';

import FundingAndBudget from './index';

const systemProfileData = getMockSystemProfileData();

describe('Funding and Budget subpage for System Profile', () => {
  it('matches snapshot', async () => {
    const { asFragment, getByText } = render(
      <MemoryRouter initialEntries={['/systems/000-100-0/funding-and-budget']}>
        <Route path="/systems/:systemId/:subinfo">
          <FundingAndBudget system={systemProfileData} />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
    expect(getByText('HAM Project funding')).toBeInTheDocument();
    expect(getByText('Fed Admin')).toBeInTheDocument();
  });
});
