import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import { mockDiscussions } from 'data/mock/discussions';
import { systemIntake } from 'data/mock/systemIntake';

import Discussions from './Discussions';

const [discussion] = mockDiscussions();

const discussionWithoutReplies: SystemIntakeGRBReviewDiscussionFragment = {
  ...discussion,
  replies: []
};

describe('Discussions', () => {
  it('renders 0 discussions without replies', () => {
    render(
      <MemoryRouter>
        <Discussions
          systemIntakeID={systemIntake.id}
          grbDiscussions={mockDiscussions()}
        />
      </MemoryRouter>
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
      <MemoryRouter>
        <Discussions
          systemIntakeID={systemIntake.id}
          grbDiscussions={[discussionWithoutReplies]}
        />
      </MemoryRouter>
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
      <MemoryRouter>
        <Discussions systemIntakeID={systemIntake.id} grbDiscussions={[]} />
      </MemoryRouter>
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