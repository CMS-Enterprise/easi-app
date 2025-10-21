import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';

import FundingAndBudget from '.';

describe('FundingAndBudget', () => {
  it('renders section name, description, and next section text', () => {
    render(
      <MemoryRouter
        initialEntries={['/systems/000-100-0/edit/funding-and-budget']}
      >
        <Route path="/systems/:systemId/edit/funding-and-budget">
          <MessageProvider>
            <FundingAndBudget />
          </MessageProvider>
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Funding and budget' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>(
          'systemProfile:sectionCards.FUNDING_AND_BUDGET.description'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText('Next section: ATO and security')
    ).toBeInTheDocument();
  });
});
