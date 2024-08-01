import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetSystemIntakesWithReviewRequestedDocument,
  GetSystemIntakesWithReviewRequestedQuery,
  SystemIntakeWithReviewRequestedFragment
} from 'gql/gen/graphql';

import users from 'data/mock/users';
import { MockedQuery } from 'types/util';
import { formatDateLocal } from 'utils/date';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import GrbParticipationNeeded from '.';

const requester = users[0];

const intake: SystemIntakeWithReviewRequestedFragment = {
  __typename: 'SystemIntake',
  id: 'b6d18b33-b204-4bd0-b14b-4f79117b97b7',
  requestName: 'Test request',
  requesterName: requester.commonName,
  requesterComponent: 'Center for Medicare',
  grbDate: '2026-10-02T03:11:24.478056Z'
};

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
        mocks={[getSystemIntakesWithReviewRequestedQuery([intake])]}
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
          mocks={[getSystemIntakesWithReviewRequestedQuery([intake])]}
        >
          <GrbParticipationNeeded />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    userEvent.click(
      await screen.findByRole('button', { name: 'Show GRB reviews' })
    );

    expect(
      screen.getByRole('link', { name: intake.requestName! })
    ).toHaveAttribute(
      'href',
      `/governance-review-board/${intake.id}/grb-review`
    );

    expect(
      screen.getByText(
        getPersonNameAndComponentAcronym(
          intake.requesterName!,
          intake.requesterComponent
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(formatDateLocal(intake.grbDate!, 'MM/dd/yyyy'))
    ).toBeInTheDocument();
  });
});
