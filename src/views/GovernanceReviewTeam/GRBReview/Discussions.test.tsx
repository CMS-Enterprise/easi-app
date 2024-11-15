import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import mockDiscussions from 'data/mock/discussions';

import Discussions from './Discussions';

const [discussion] = mockDiscussions();

const discussionWithoutReplies: SystemIntakeGRBReviewDiscussionFragment = {
  ...discussion,
  replies: []
};

describe('Discussions', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <Discussions grbDiscussions={mockDiscussions()} />
    );

    expect(asFragment()).toMatchSnapshot(`[Function]`);
  });

  it('renders discussion with replies', () => {
    render(<Discussions grbDiscussions={mockDiscussions()} />);

    expect(
      screen.getByRole('heading', { name: 'Most recent activity' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('0 discussions without replies')
    ).toBeInTheDocument();

    expect(screen.queryByRole('img', { name: 'warning icon' })).toBeNull();

    expect(screen.queryByRole('button', { name: 'View' })).toBeNull();
  });

  it('renders discussion without replies', () => {
    render(<Discussions grbDiscussions={[discussionWithoutReplies]} />);

    expect(
      screen.getByText('1 discussion without replies')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('img', { name: 'warning icon' })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();
  });

  it('renders discussion board with no discussions', () => {
    render(<Discussions grbDiscussions={[]} />);

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
