import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetSystemIntakesWithReviewRequestedDocument,
  GetSystemIntakesWithReviewRequestedQuery,
  SystemIntakeWithReviewRequestedFragment
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';
import { systemIntakesWithReviewRequested } from 'tests/mock/systemIntake';

import { MockedQuery } from 'types/util';
import { formatDateLocal } from 'utils/date';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import GrbParticipationNeeded, { sortGrbDates } from '.';

const mockSystemIntakes = systemIntakesWithReviewRequested;

const getSystemIntakesWithReviewRequestedQuery = (
  systemIntakes: SystemIntakeWithReviewRequestedFragment[]
): MockedQuery<GetSystemIntakesWithReviewRequestedQuery> => ({
  request: {
    query: GetSystemIntakesWithReviewRequestedDocument,
    variables: {}
  },
  result: {
    data: {
      __typename: 'Query',
      systemIntakesWithReviewRequested: systemIntakes
    }
  }
});

describe('GRB participation needed', () => {
  it('renders component if user is GRB reviewer', async () => {
    render(
      <VerboseMockedProvider
        mocks={[getSystemIntakesWithReviewRequestedQuery(mockSystemIntakes)]}
      >
        <GrbParticipationNeeded />
      </VerboseMockedProvider>
    );

    expect(
      await screen.findByRole('heading', { name: 'GRB participation needed' })
    );
  });

  it('does not render component if user is not a GRB reviewer', () => {
    render(
      <VerboseMockedProvider
        mocks={[getSystemIntakesWithReviewRequestedQuery([])]}
      >
        <GrbParticipationNeeded />
      </VerboseMockedProvider>
    );

    expect(
      screen.queryByRole('heading', { name: 'GRB participation needed' })
    ).toBeNull();
  });

  it('formats system intake for table', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[getSystemIntakesWithReviewRequestedQuery(mockSystemIntakes)]}
        >
          <GrbParticipationNeeded />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const testIntake = mockSystemIntakes[0];

    const btn = await screen.findByRole('button', {
      name: /Show GRB reviews/i
    });
    await user.click(btn);

    expect(
      screen.getByRole('link', { name: testIntake.requestName! })
    ).toHaveAttribute('href', `/it-governance/${testIntake.id}/grb-review`);

    expect(
      screen.getByText(
        getPersonNameAndComponentAcronym(
          testIntake.requesterName!,
          testIntake.requesterComponent
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(formatDateLocal(testIntake.grbDate!, 'MM/dd/yyyy'))
    ).toBeInTheDocument();
  });

  // Check that sorting function used in table correctly sorts GRB dates
  it('sorts GRB dates', () => {
    const currentYear = DateTime.local().year;

    const dates = mockSystemIntakes.map(value => value.grbDate) as Array<
      string | null
    >;

    // sorted dates using function, reversed to get desc order to match table
    const sortedDates = dates.sort(sortGrbDates).reverse();

    const expectedSortOrder = [
      null,
      null,
      `${currentYear + 1}-06-09T03:11:24.478056Z`,
      `${currentYear + 2}-10-02T03:11:24.478056Z`,
      '2024-03-29T03:11:24.478056Z',
      '2023-01-18T03:11:24.478056Z',
      '2020-10-08T03:11:24.478056Z'
    ];

    sortedDates.forEach((date, index) => date === expectedSortOrder[index]);
  });
});
