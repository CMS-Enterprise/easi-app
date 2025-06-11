import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import {
  GetSystemIntakeGRBDiscussionsDocument,
  GetSystemIntakeGRBDiscussionsQuery,
  GetSystemIntakeGRBDiscussionsQueryVariables,
  SystemIntakeGRBReviewDiscussionFragment
} from 'gql/generated/graphql';
import i18next from 'i18next';
import { mockDiscussions } from 'tests/mock/discussions';
import { systemIntake } from 'tests/mock/systemIntake';

import { MockedQuery } from 'types/util';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Discussions from '.';

const [discussion] = mockDiscussions();

const discussionWithoutReplies: SystemIntakeGRBReviewDiscussionFragment = {
  ...discussion,
  replies: []
};

const getSystemIntakeGRBDiscussions = (
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[]
): MockedQuery<
  GetSystemIntakeGRBDiscussionsQuery,
  GetSystemIntakeGRBDiscussionsQueryVariables
> => ({
  request: {
    query: GetSystemIntakeGRBDiscussionsDocument,
    variables: {
      id: systemIntake.id
    }
  },
  result: {
    data: {
      __typename: 'Query',
      systemIntake: {
        __typename: 'SystemIntake',
        id: systemIntake.id,
        grbDiscussions
      }
    }
  }
});

describe('Discussions', () => {
  it('renders 0 discussions without replies', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[getSystemIntakeGRBDiscussions(mockDiscussions())]}
        >
          <Discussions
            grbReviewStartedAt="2025-03-11T01:50:35.146458Z"
            grbReviewers={[]}
            systemIntakeID={systemIntake.id}
          />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByRole('heading', { name: /Most recent activity/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText('0 discussions without replies')
    ).toBeInTheDocument();

    expect(screen.queryByRole('img', { name: /warning icon/i })).toBeNull();

    expect(screen.queryByRole('button', { name: 'View' })).toBeNull();
  });

  it('renders 1 discussion without replies', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[getSystemIntakeGRBDiscussions([discussionWithoutReplies])]}
        >
          <Discussions
            grbReviewStartedAt="2025-03-11T01:50:35.146458Z"
            grbReviewers={[]}
            systemIntakeID={systemIntake.id}
          />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText('1 discussion without replies')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('img', { name: 'warning icon' })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /View/i })).toBeInTheDocument();
  });

  it('renders discussion board with no discussions', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={[getSystemIntakeGRBDiscussions([])]}>
          <Discussions
            grbReviewStartedAt="2025-03-11T01:50:35.146458Z"
            grbReviewers={[]}
            systemIntakeID={systemIntake.id}
          />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    const noDiscussionsAlert = await screen.findByTestId('alert');
    const startDiscussionButton = within(noDiscussionsAlert).getByRole(
      'button',
      { name: 'Start a discussion' }
    );

    expect(startDiscussionButton).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'Most recent activity' })
    ).toBeNull();
  });

  it('locks discussion board if review not started', async () => {
    render(
      <MemoryRouter>
        <VerboseMockedProvider
          mocks={[getSystemIntakeGRBDiscussions(mockDiscussions())]}
        >
          <Discussions grbReviewers={[]} systemIntakeID={systemIntake.id} />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText(
        i18next.t<string>('discussions:general.alerts.reviewNotStarted')
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /View discussion board/i })
    ).toBeDisabled();
  });
});
