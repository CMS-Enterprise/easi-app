import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetSystemIntakesWithReviewRequestedDocument,
  GetSystemIntakesWithReviewRequestedQuery,
  SystemIntakeWithReviewRequestedFragment
} from 'gql/gen/graphql';
import { DateTime } from 'luxon';

import users from 'data/mock/users';
import { MockedQuery } from 'types/util';
import { formatDateLocal } from 'utils/date';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import GrbParticipationNeeded, { sortGrbDates } from '.';

const currentYear = DateTime.local().year;

// eslint-disable-next-line
export const mockSystemIntakes: SystemIntakeWithReviewRequestedFragment[] = [
  {
    id: 'a5689bec-e4cf-4f2b-a7de-72020e8d65be',
    requestName: 'With GRB scheduled',
    requesterName: users[3].commonName,
    requesterComponent: 'Office of Enterprise Data and Analytics',
    grbDate: `${currentYear + 2}-10-02T03:11:24.478056Z`,
    __typename: 'SystemIntake'
  },
  {
    id: '5af245bc-fc54-4677-bab1-1b3e798bb43c',
    requestName: 'System Intake with GRB Reviewers',
    requesterName: 'User One',
    requesterComponent: 'Office of the Actuary',
    grbDate: '2020-10-08T03:11:24.478056Z',
    __typename: 'SystemIntake'
  },
  {
    id: '29486f85-1aba-4eaf-a7dd-6137b9873adc',
    requestName: 'Edits requested on initial request form',
    requesterName: users[0].commonName,
    requesterComponent: 'Federal Coordinated Health Care Office',
    grbDate: null,
    __typename: 'SystemIntake'
  },
  {
    id: '29486f85-1aba-4eaf-a7dd-6137b9873adc',
    requestName: 'Mock System Intake 1',
    requesterName: users[1].commonName,
    requesterComponent: 'Office of Communications',
    grbDate: '2024-03-29T03:11:24.478056Z',
    __typename: 'SystemIntake'
  },
  {
    id: '29486f85-1aba-4eaf-a7dd-6137b9873adc',
    requestName: 'Mock System Intake 2',
    requesterName: users[2].commonName,
    requesterComponent: 'Office of the Actuary',
    grbDate: `${currentYear + 1}-06-09T03:11:24.478056Z`,
    __typename: 'SystemIntake'
  },

  {
    id: '20cbcfbf-6459-4c96-943b-e76b83122dbf',
    requestName: 'Closable Request',
    requesterName: users[3].commonName,
    requesterComponent: 'Office of Information Technology',
    grbDate: '2023-01-18T03:11:24.478056Z',
    __typename: 'SystemIntake'
  },
  {
    id: '29486f85-1aba-4eaf-a7dd-6137b9873adc',
    requestName: 'Mock System Intake 3',
    requesterName: users[2].commonName,
    requesterComponent: 'Office of Information Technology',
    grbDate: null,
    __typename: 'SystemIntake'
  }
];

const getSystemIntakesWithReviewRequestedQuery = (
  systemIntakesWithReviewRequested: SystemIntakeWithReviewRequestedFragment[]
): MockedQuery<GetSystemIntakesWithReviewRequestedQuery> => ({
  request: {
    query: GetSystemIntakesWithReviewRequestedDocument,
    variables: {}
  },
  result: {
    data: {
      __typename: 'Query',
      systemIntakesWithReviewRequested
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

    const testIntake = mockSystemIntakes[0];

    userEvent.click(
      await screen.findByRole('button', { name: 'Show GRB reviews' })
    );

    expect(
      screen.getByRole('link', { name: testIntake.requestName! })
    ).toHaveAttribute(
      'href',
      `/governance-review-board/${testIntake.id}/grb-review`
    );

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
