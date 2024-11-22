import React from 'react';
import { render, screen, within } from '@testing-library/react';
import {
  GetSystemIntakeGRBDiscussionsDocument,
  GetSystemIntakeGRBDiscussionsQuery,
  GetSystemIntakeGRBDiscussionsQueryVariables,
  SystemIntakeGRBReviewDiscussionFragment
} from 'gql/gen/graphql';

import { mockDiscussions } from 'data/mock/discussions';
import { systemIntake } from 'data/mock/systemIntake';
import { MockedQuery } from 'types/util';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Discussions from './Discussions';

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
  it('renders 0 discussions without replies', () => {
    render(
      <VerboseMockedProvider
        mocks={[getSystemIntakeGRBDiscussions(mockDiscussions())]}
      >
        <Discussions systemIntakeID={systemIntake.id} />
      </VerboseMockedProvider>
    );

    expect(
      screen.getByRole('heading', { name: 'Most recent activity' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('0 discussions without replies')
    ).toBeInTheDocument();

    expect(screen.queryByRole('img', { name: 'warning icon' })).toBeNull();

    expect(screen.queryByRole('button', { name: 'View' })).toBeNull();
  });

  it('renders 1 discussion without replies', () => {
    render(
      <VerboseMockedProvider
        mocks={[getSystemIntakeGRBDiscussions([discussionWithoutReplies])]}
      >
        <Discussions systemIntakeID={systemIntake.id} />
      </VerboseMockedProvider>
    );

    expect(
      screen.getByText('1 discussion without replies')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('img', { name: 'warning icon' })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();
  });

  it('renders discussion board with no discussions', () => {
    render(
      <VerboseMockedProvider mocks={[getSystemIntakeGRBDiscussions([])]}>
        <Discussions systemIntakeID={systemIntake.id} />
      </VerboseMockedProvider>
    );

    expect(
      screen.queryByRole('heading', { name: 'Most recent activity' })
    ).toBeNull();

    const noDiscussionsAlert = screen.getByTestId('alert');
    const startDiscussionButton = within(noDiscussionsAlert).getByRole(
      'button',
      { name: 'Start a discussion' }
    );

    expect(startDiscussionButton).toBeInTheDocument();
  });
});
