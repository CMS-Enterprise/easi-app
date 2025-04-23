import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { SystemIntakeGRBDiscussionBoardType } from 'gql/generated/graphql';
import {
  mockDiscussions,
  mockDiscussionsWithoutReplies
} from 'tests/mock/discussions';

import DiscussionBoardSummary from '.';

describe('Discussion board summary', () => {
  it('renders the primary discussion board', () => {
    render(
      <MemoryRouter>
        <DiscussionBoardSummary
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.PRIMARY}
          grbDiscussions={mockDiscussions()}
          grbReviewStartedAt="2025-03-11T01:50:35.146458Z"
          loading={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Primary discussion board')).toBeInTheDocument();

    expect(screen.getByText('Not restricted')).toBeInTheDocument();
  });

  it('renders the internal discussion board', () => {
    render(
      <MemoryRouter>
        <DiscussionBoardSummary
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.INTERNAL}
          grbDiscussions={mockDiscussions()}
          grbReviewStartedAt="2025-03-11T01:50:35.146458Z"
          loading={false}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Internal GRB discussion board')
    ).toBeInTheDocument();

    expect(screen.getByText('Visibility restricted')).toBeInTheDocument();
  });

  it('renders 0 discussions without replies', async () => {
    render(
      <MemoryRouter>
        <DiscussionBoardSummary
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.PRIMARY}
          grbDiscussions={mockDiscussions()}
          grbReviewStartedAt="2025-03-11T01:50:35.146458Z"
          loading={false}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText('0 discussions without replies')
    ).toBeInTheDocument();

    expect(screen.queryByRole('img', { name: 'warning icon' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'View' })).toBeNull();
  });

  it('renders discussions without replies', async () => {
    render(
      <MemoryRouter>
        <DiscussionBoardSummary
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.PRIMARY}
          grbDiscussions={mockDiscussionsWithoutReplies()}
          grbReviewStartedAt="2025-03-11T01:50:35.146458Z"
          loading={false}
        />
      </MemoryRouter>
    );

    expect(
      await screen.findByText('4 discussions without replies')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('img', { name: 'warning icon' })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();
  });

  it('locks discussion board if review not started', async () => {
    render(
      <MemoryRouter>
        <DiscussionBoardSummary
          discussionBoardType={SystemIntakeGRBDiscussionBoardType.PRIMARY}
          grbDiscussions={[]}
          grbReviewStartedAt={undefined}
          loading={false}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        'This review is not yet started. Start the review to enable discussions.'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'View discussion board' })
    ).toBeDisabled();
  });
});
