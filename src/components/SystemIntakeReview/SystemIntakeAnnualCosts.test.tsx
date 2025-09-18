import React from 'react';
import { render, screen } from '@testing-library/react';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import SystemIntakeAnnualCosts from './SystemIntakeAnnualCosts';

describe('SystemIntakeAnnualCosts', () => {
  describe('SystemIntakeAnnualCosts component', () => {
    it('renders the formatted annual spending data', () => {
      const annualSpending: SystemIntakeFragmentFragment['annualSpending'] = {
        __typename: 'SystemIntakeAnnualSpending',
        currentAnnualSpending: '3.50',
        currentAnnualSpendingITPortion: '35',
        plannedYearOneSpending: '123456',
        plannedYearOneSpendingITPortion: '50'
      };

      render(
        <SystemIntakeAnnualCosts annualSpending={annualSpending} costs={null} />
      );

      expect(screen.getByText('$3.5')).toBeInTheDocument();
      expect(screen.getByText('35%')).toBeInTheDocument();
      expect(screen.getByText('$123,456')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('renders annual spending data when not a number (legacy data)', () => {
      const legacyAnnualSpending: SystemIntakeFragmentFragment['annualSpending'] =
        {
          __typename: 'SystemIntakeAnnualSpending',
          currentAnnualSpending: 'Kind of a lot',
          currentAnnualSpendingITPortion: 'A big percentage',
          plannedYearOneSpending: 'Less than a million',
          plannedYearOneSpendingITPortion: 'A small percentage'
        };

      render(
        <SystemIntakeAnnualCosts
          annualSpending={legacyAnnualSpending}
          costs={null}
        />
      );

      expect(screen.getByText('Kind of a lot')).toBeInTheDocument();
      expect(screen.getByText('A big percentage')).toBeInTheDocument();
      expect(screen.getByText('Less than a million')).toBeInTheDocument();
      expect(screen.getByText('A small percentage')).toBeInTheDocument();
    });

    it('renders increased cost data', () => {
      const costs: SystemIntakeFragmentFragment['costs'] = {
        __typename: 'SystemIntakeCosts',
        isExpectingIncrease: 'YES',
        expectedIncreaseAmount: 'less than $1 million'
      };

      render(<SystemIntakeAnnualCosts annualSpending={null} costs={costs} />);

      expect(screen.getByText('less than $1 million')).toBeInTheDocument();
    });
  });
});
