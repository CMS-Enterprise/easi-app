import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import IntakeRequestCard from './index';

describe('IntakeRequestCard', () => {
  it('renders default version without crashing', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <IntakeRequestCard
          systemIntakeID="ABC123"
          currentStage="I have an idea and want to brainstorm"
          // annualSpending={{
          //   __typename: 'SystemIntakeAnnualSpending',
          //   currentAnnualSpending: '$1,500,000',
          //   currentAnnualSpendingITPortion: '50%',
          //   plannedYearOneSpending: '$1,750,000',
          //   plannedYearOneSpendingITPortion: '75%'
          // }}
          annualSpending={null}
          totalContractCosts={{
            __typename: 'SystemIntakeTotalContractCosts',
            currentEstimatedCost: '$2,000,000',
            currentEstimatedCostITPortion: '60%',
            estimatedTotalContractValue: '$3,000,000',
            estimatedTotalContractValueITPortion: '70%'
          }}
          submittedAt="2021-07-01T00:00:00Z"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Completed 07/01/2021')).toBeInTheDocument();
    expect(
      screen.getByText('I have an idea and want to brainstorm')
    ).toBeInTheDocument();
    expect(screen.getByText('$2,000,000')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('$3,000,000')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders historical costs and spending information without crashing', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <IntakeRequestCard
          systemIntakeID="ABC123"
          currentStage="I have an idea and want to brainstorm"
          annualSpending={{
            __typename: 'SystemIntakeAnnualSpending',
            currentAnnualSpending: '$1,500,000',
            currentAnnualSpendingITPortion: '50%',
            plannedYearOneSpending: '$1,750,000',
            plannedYearOneSpendingITPortion: '75%'
          }}
          totalContractCosts={null}
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
