import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import { GRBVotingInformationStatus } from 'gql/generated/graphql';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';

import AddTimeOrEndVoting from './index';

describe('AddTimeOrEndVoting', () => {
  const mockProps = {
    grbReviewAsyncEndDate: '2025-03-30T12:00:00Z',
    grbVotingInformation: {
      __typename: 'GRBVotingInformation' as const,
      grbReviewers: [],
      votingStatus: GRBVotingInformationStatus.NOT_STARTED,
      numberOfNoObjection: 3,
      numberOfObjection: 1,
      numberOfNotVoted: 2
    }
  };

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <MockedProvider>
          <MessageProvider>
            <AddTimeOrEndVoting {...mockProps} />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
  };

  it('opens the "Add Time" modal when the "Add Time" button is clicked', () => {
    renderComponent();

    // Click the "Add Time" button
    fireEvent.click(
      screen.getByText(i18next.t<string>('grbReview:statusCard.addTime'))
    );

    // Check that the "Add Time" modal is open
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:statusCard.addTimeModal.heading')
      )
    ).toBeInTheDocument();
  });

  it('disables the "Add Time" button in the modal when no date is selected', () => {
    renderComponent();

    // Open the "Add Time" modal
    fireEvent.click(
      screen.getByText(i18next.t<string>('grbReview:statusCard.addTime'))
    );

    // Check that the "Add Time" button is disabled
    expect(
      screen.queryAllByRole('button', {
        name: i18next.t<string>('grbReview:statusCard.addTimeModal.addTime')
      })[1]
    ).toBeDisabled();
  });

  it('opens the "End Voting" modal when the "End Voting" button is clicked', () => {
    renderComponent();

    // Click the "End Voting" button
    fireEvent.click(
      screen.getByText(i18next.t<string>('grbReview:statusCard.endVoting'))
    );

    // Check that the "End Voting" modal is open
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:statusCard.endVotingModal.heading')
      )
    ).toBeInTheDocument();
  });

  it('closes the modal when the "Go Back" button is clicked', () => {
    renderComponent();

    // Open the "Add Time" modal
    fireEvent.click(
      screen.getByText(i18next.t<string>('grbReview:statusCard.addTime'))
    );

    // Click the "Go Back" button
    fireEvent.click(
      screen.getByText(
        i18next.t<string>('grbReview:statusCard.addTimeModal.goBack')
      )
    );

    // Check that the modal is closed
    expect(
      screen.queryByText(
        i18next.t<string>('grbReview:statusCard.addTimeModal.heading')
      )
    ).not.toBeInTheDocument();
  });
});
