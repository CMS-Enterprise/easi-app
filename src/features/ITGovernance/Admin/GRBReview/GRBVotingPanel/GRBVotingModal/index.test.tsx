import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  SystemIntakeAsyncGRBVotingOption,
  SystemIntakeGRBReviewerFragment
} from 'gql/generated/graphql';
import i18next from 'i18next';
import { grbReviewer as mockGrbReviewer } from 'tests/mock/grbReview';

import GRBVotingModal from './index';

describe('GRBVotingModal', () => {
  const renderComponent = (grbReviewer = mockGrbReviewer) => {
    return render(
      <MemoryRouter>
        <MockedProvider>
          <GRBVotingModal grbReviewer={grbReviewer} />
        </MockedProvider>
      </MemoryRouter>
    );
  };

  it('renders correctly when the user has already voted', () => {
    renderComponent();

    // Check that the "Change Vote" button is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:reviewTask.voting.changeVote')
      )
    ).toBeInTheDocument();
  });

  it('renders correctly when the user has not voted', () => {
    const grbReviewer = {
      vote: null,
      voteComment: null,
      dateVoted: null
    } as SystemIntakeGRBReviewerFragment;

    renderComponent(grbReviewer);

    // Check that the "No Objection" and "Object" buttons are rendered
    expect(
      screen.getByText(i18next.t<string>('grbReview:reviewTask.voting.object'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        i18next.t<string>(
          `grbReview:reviewTask.voting.${SystemIntakeAsyncGRBVotingOption.NO_OBJECTION}`
        )
      )
    ).toBeInTheDocument();
  });

  it('opens the modal when "Change Vote" button is clicked', () => {
    renderComponent();

    // Click the "Change Vote" button
    fireEvent.click(
      screen.getByText(
        i18next.t<string>('grbReview:reviewTask.voting.changeVote')
      )
    );

    // Check that the modal is open
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:reviewTask.voting.modal.titleChangeVote')
      )
    ).toBeInTheDocument();
  });

  it('closes the modal and resets the form when "Cancel" button is clicked', () => {
    renderComponent();

    // Open the modal
    fireEvent.click(
      screen.getByText(
        i18next.t<string>('grbReview:reviewTask.voting.changeVote')
      )
    );

    // Check that the modal is open
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:reviewTask.voting.modal.titleChangeVote')
      )
    ).toBeInTheDocument();

    // Click the "Cancel" button
    fireEvent.click(
      screen.getByText(
        i18next.t<string>('grbReview:reviewTask.voting.modal.keepExistingVote')
      )
    );

    // Check that the modal is closed
    expect(
      screen.queryByText(
        i18next.t<string>('grbReview:reviewTask.voting.modal.titleChangeVote')
      )
    ).not.toBeInTheDocument();
  });
});
