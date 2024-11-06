import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { cloneDeep, toString } from 'lodash';

import { BUDGET_ITEMS_COUNT_CAP } from 'constants/systemProfile';
import { getMockSystemProfileData, result } from 'data/mock/systemProfile';
// eslint-disable-next-line camelcase
import { GetSystemProfile_cedarBudget } from 'queries/types/GetSystemProfile';

import FundingAndBudget from './index';

const systemProfileData = getMockSystemProfileData();

describe(`System Profile Funding and Budget section collapse/expand toggle at ${BUDGET_ITEMS_COUNT_CAP}`, () => {
  const buttonExpandToggleMatchOpt = {
    name: /Show more budget projects/i
  };

  function fillBudgetItems(
    count: number
    // eslint-disable-next-line camelcase
  ): GetSystemProfile_cedarBudget[] {
    return Array(count)
      .fill(0)
      .map((_, index) => {
        return {
          fiscalYear: '',
          funding: '',
          fundingId: '',
          fundingSource: '',
          id: toString(index),
          name: '',
          projectId: '12345',
          projectTitle: '',
          systemId: '',
          __typename: 'CedarBudget'
        };
      });
  }

  it(`doesn't show toggles for all sections`, () => {
    render(
      <MemoryRouter initialEntries={['/systems/000-100-0/funding-and-budget']}>
        <Route path="/systems/:systemId/:subinfo">
          <FundingAndBudget system={systemProfileData} />
        </Route>
      </MemoryRouter>
    );

    // Doesn't show the button expand toggle at cap
    const data = getMockSystemProfileData(result.data);
    const { queryAllByRole } = render(<FundingAndBudget system={data} />);
    expect(queryAllByRole('button', buttonExpandToggleMatchOpt)).toHaveLength(
      0
    );
  });

  it(`section init collapsed & expands`, async () => {
    const res = cloneDeep(result.data);

    // Fill more members than the cap
    const total = BUDGET_ITEMS_COUNT_CAP + 2;
    res.cedarBudget = fillBudgetItems(total);
    const data = getMockSystemProfileData(res);
    const { getByRole, getAllByTestId } = render(
      <FundingAndBudget system={data} />
    );

    // Check count when collapsed
    expect(getAllByTestId('budget-project-card')).toHaveLength(
      BUDGET_ITEMS_COUNT_CAP
    );

    // Toggle expand
    fireEvent.click(getByRole('button', buttonExpandToggleMatchOpt));
    await waitFor(() => {
      expect(
        getByRole('button', {
          name: /Show fewer budget projects/i
        })
      ).toBeInTheDocument();
    });

    // Expanded count
    expect(getAllByTestId('budget-project-card')).toHaveLength(total);
  });
});
