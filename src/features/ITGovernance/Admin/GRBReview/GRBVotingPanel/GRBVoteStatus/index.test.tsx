import React from 'react';
import { render, screen } from '@testing-library/react';
import { SystemIntakeAsyncGRBVotingOption } from 'gql/generated/graphql';
import i18next from 'i18next';

import GRBVoteStatus from './index';

describe('GRBVoteStatus', () => {
  it('renders correctly with vote and dateVoted', () => {
    render(
      <GRBVoteStatus
        vote={SystemIntakeAsyncGRBVotingOption.NO_OBJECTION}
        dateVoted="2025-03-21"
        className="test-class"
      />
    );

    // Check that the "You Voted" text is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:reviewTask.voting.youVoted')
      )
    ).toBeInTheDocument();

    // Check that the correct tag is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:reviewTask.voting.NO_OBJECTION')
      )
    ).toBeInTheDocument();

    // Check that the date is formatted correctly
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:reviewTask.voting.votedOn', {
          date: 'March 21, 2025'
        })
      )
    ).toBeInTheDocument();

    // Check that the tag has the correct class for NO_OBJECTION
    const tag = screen.getByTestId('vote-tag');
    expect(tag).toHaveClass('bg-success-dark');
  });

  it('renders null when vote is missing', () => {
    const { container } = render(
      <GRBVoteStatus vote={null} dateVoted="2025-03-21" />
    );

    // Ensure the component renders nothing
    expect(container.firstChild).toBeNull();
  });

  it('renders null when dateVoted is missing', () => {
    const { container } = render(
      <GRBVoteStatus
        vote={SystemIntakeAsyncGRBVotingOption.OBJECTION}
        dateVoted={null}
      />
    );

    // Ensure the component renders nothing
    expect(container.firstChild).toBeNull();
  });

  it('applies the correct tag color for OBJECTION', () => {
    render(
      <GRBVoteStatus
        vote={SystemIntakeAsyncGRBVotingOption.OBJECTION}
        dateVoted="2025-03-21"
      />
    );

    // Check that the tag has the correct class for OBJECTION
    const tag = screen.getByTestId('vote-tag');
    expect(tag).toHaveClass('bg-error-dark');
  });
});
