import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  SystemIntakeAsyncGRBVotingOption,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/generated/graphql';
import { grbReviewers } from 'tests/mock/grbReview';

import GRBReviewerVote from './GRBReviewerVote';

describe('GRB review decision record table', () => {
  const reviewer = grbReviewers[1];

  it('renders "No objection" vote with "View comment" button', () => {
    render(
      <GRBReviewerVote
        grbReviewer={{
          ...reviewer,
          votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
          vote: SystemIntakeAsyncGRBVotingOption.NO_OBJECTION
        }}
        setGRBReviewerViewComment={vi.fn()}
      />
    );

    expect(screen.getByText('No objection')).toBeInTheDocument();
    expect(screen.getByTestId('icon-CheckCircle')).toHaveClass('text-success');

    expect(
      screen.getByRole('button', { name: 'View comment' })
    ).toBeInTheDocument();
  });

  it('renders "Objection" vote', () => {
    render(
      <GRBReviewerVote
        grbReviewer={{
          ...reviewer,
          votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
          vote: SystemIntakeAsyncGRBVotingOption.OBJECTION
        }}
        setGRBReviewerViewComment={vi.fn()}
      />
    );

    expect(screen.getByText('Objection')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Cancel')).toHaveClass('text-error');
  });

  it('renders "No vote cast"', () => {
    render(
      <GRBReviewerVote
        grbReviewer={{
          ...reviewer,
          votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
          vote: null
        }}
        setGRBReviewerViewComment={vi.fn()}
      />
    );

    expect(screen.getByText('No vote cast')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Help')).toHaveClass('text-base-light');
  });

  it('renders empty cell for non-voting members', () => {
    render(
      <GRBReviewerVote
        grbReviewer={{
          ...reviewer,
          votingRole: SystemIntakeGRBReviewerVotingRole.NON_VOTING
        }}
        setGRBReviewerViewComment={vi.fn()}
      />
    );

    expect(screen.queryByTestId('grbReviewerVote')).toBeNull();
  });

  it('hides "View comment" link', () => {
    render(
      <GRBReviewerVote
        grbReviewer={{
          ...reviewer,
          votingRole: SystemIntakeGRBReviewerVotingRole.VOTING,
          voteComment: null
        }}
      />
    );

    expect(screen.queryByRole('button', { name: 'View comment' })).toBeNull();
  });
});
