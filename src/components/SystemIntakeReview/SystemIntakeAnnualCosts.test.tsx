import React from 'react';
import { render, screen } from '@testing-library/react';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import SystemIntakeAnnualCosts from './SystemIntakeAnnualCosts';

describe('SystemIntakeAnnualCosts', () => {
  describe('SystemIntakeAnnualCosts component', () => {
    it('renders the new "total" contract costs data', () => {
      const totalContractCosts: SystemIntakeFragmentFragment['totalContractCosts'] =
        {
          __typename: 'SystemIntakeTotalContractCosts',

          currentEstimatedCost: '31525',
          currentEstimatedCostITPortion: '75',
          estimatedTotalContractValue: '456789',
          estimatedTotalContractValueITPortion: '100'
        };

      render(
        <SystemIntakeAnnualCosts
          annualSpending={null}
          totalContractCosts={totalContractCosts}
          costs={null}
        />
      );

      expect(screen.getByText('$31,525')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('$456,789')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('renders the formatted annual spending data', () => {
      const annualSpending: SystemIntakeFragmentFragment['annualSpending'] = {
        __typename: 'SystemIntakeAnnualSpending',
        currentAnnualSpending: '3.50',
        currentAnnualSpendingITPortion: '35',
        plannedYearOneSpending: '123456',
        plannedYearOneSpendingITPortion: '50'
      };

      render(
        <SystemIntakeAnnualCosts
          annualSpending={annualSpending}
          totalContractCosts={null}
          costs={null}
        />
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
          totalContractCosts={null}
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

      render(
        <SystemIntakeAnnualCosts
          totalContractCosts={null}
          annualSpending={null}
          costs={costs}
        />
      );

      expect(screen.getByText('less than $1 million')).toBeInTheDocument();
    });
  });
});
