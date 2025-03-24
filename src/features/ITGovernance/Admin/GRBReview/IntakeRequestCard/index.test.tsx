import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import IntakeRequestCard from './index';

describe('IntakeRequestCard', () => {
  it('renders default version without crashing', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <IntakeRequestCard
          currentStage="I have an idea and want to brainstorm"
          annualSpending={{
            __typename: 'SystemIntakeAnnualSpending',
            currentAnnualSpending: '$1,500,000',
            currentAnnualSpendingITPortion: '50%',
            plannedYearOneSpending: '$1,750,000',
            plannedYearOneSpendingITPortion: '75%'
          }}
          submittedAt="2021-07-01T00:00:00Z"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Completed 07/01/2021')).toBeInTheDocument();
    expect(
      screen.getByText('I have an idea and want to brainstorm')
    ).toBeInTheDocument();
    expect(screen.getByText('$1,500,000')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('$1,750,000')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
