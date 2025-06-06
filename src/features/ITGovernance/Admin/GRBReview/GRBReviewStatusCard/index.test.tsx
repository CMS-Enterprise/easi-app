import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  GRBVotingInformationStatus,
  SystemIntakeGRBReviewAsyncStatusType,
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewStandardStatusType,
  SystemIntakeGRBReviewType
} from 'gql/generated/graphql';
import i18next from 'i18next';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import { MessageProvider } from 'hooks/useMessage';

import { ModalProvider } from '../RestartReviewModal/RestartReviewModalContext';

import GRBReviewStatusCard from './index';

describe('GRBReviewStatusCard', () => {
  const mockStandardReview: SystemIntakeGRBReviewFragment = {
    __typename: 'SystemIntake',
    grbReviewType: SystemIntakeGRBReviewType.STANDARD,
    grbReviewAsyncStatus: null,
    grbReviewStandardStatus: SystemIntakeGRBReviewStandardStatusType.SCHEDULED,
    grbDate: '2025-03-28T12:00:00Z',
    grbReviewStartedAt: '2025-03-27T12:00:00Z',
    grbReviewAsyncEndDate: null,
    grbVotingInformation: {
      __typename: 'GRBVotingInformation',
      grbReviewers: [],
      numberOfNoObjection: 0,
      numberOfNotVoted: 0,
      numberOfObjection: 0,
      votingStatus: GRBVotingInformationStatus.NOT_STARTED
    },
    id: '123',
    documents: []
  };

  const mockAsyncReview: SystemIntakeGRBReviewFragment = {
    __typename: 'SystemIntake',
    grbReviewType: SystemIntakeGRBReviewType.ASYNC,
    grbReviewAsyncStatus: SystemIntakeGRBReviewAsyncStatusType.IN_PROGRESS,
    grbDate: null,
    grbReviewStartedAt: '2025-03-27T12:00:00Z',
    grbReviewAsyncEndDate: '2025-03-30T12:00:00Z',
    grbVotingInformation: {
      __typename: 'GRBVotingInformation',
      grbReviewers: [],
      numberOfNoObjection: 0,
      numberOfNotVoted: 0,
      numberOfObjection: 0,
      votingStatus: GRBVotingInformationStatus.NOT_STARTED
    },
    id: '123',
    documents: []
  };

  const renderComponent = (
    grbReview: SystemIntakeGRBReviewFragment,
    isITGovAdmin = true
  ) => {
    return render(
      <MemoryRouter>
        <MockedProvider addTypename={false}>
          <MessageProvider>
            <ModalProvider>
              <ITGovAdminContext.Provider value={isITGovAdmin}>
                <GRBReviewStatusCard grbReview={grbReview} />
              </ITGovAdminContext.Provider>
            </ModalProvider>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
  };

  it('renders the Standard Card when grbReviewType is STANDARD', () => {
    const { asFragment } = renderComponent(mockStandardReview);

    // Check that the standard heading is rendered
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:statusCard.standardHeading')
      )
    ).toBeInTheDocument();

    // Check that the meeting date is displayed
    expect(screen.getByText('03/28/2025')).toBeInTheDocument();

    // Check that the "Change Meeting Date" button is displayed for ITGov admins
    expect(
      screen.getByText(
        i18next.t<string>('grbReview:statusCard.changeMeetingDate')
      )
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the Async Card when grbReviewType is ASYNC', () => {
    renderComponent(mockAsyncReview);

    // Check that the async heading is rendered
    expect(
      screen.getByText(i18next.t<string>('grbReview:statusCard.asyncHeading'))
    ).toBeInTheDocument();

    // Check that the time remaining is displayed
    expect(
      screen.getByText(i18next.t<string>('grbReview:statusCard.timeRemaining'))
    ).toBeInTheDocument();
  });

  it('displays the Add Time or End Voting section for ITGov admins in async review', () => {
    renderComponent(mockAsyncReview);

    // Check that the Add Time or End Voting section is rendered
    expect(
      screen.getByText(i18next.t<string>('grbReview:statusCard.addTime'))
    ).toBeInTheDocument();

    expect(
      screen.getByText(i18next.t<string>('grbReview:statusCard.endVoting'))
    ).toBeInTheDocument();
  });

  it('renders nothing if grbReviewStartedAt is not set', () => {
    const reviewWithoutStartDate = {
      ...mockStandardReview,
      grbReviewStartedAt: null
    };

    const { container } = renderComponent(reviewWithoutStartDate);

    // Ensure the component renders nothing
    expect(container.firstChild).toBeNull();
  });

  it('renders GRB reviewer view - in progress', () => {
    renderComponent(mockStandardReview, false);

    // Check that the Add Time or End Voting button is not displayed
    expect(
      screen.queryByText(i18next.t<string>('grbReview:statusCard.addTime'))
    ).not.toBeInTheDocument();
  });

  it('renders GRB reviewer view - completed', () => {
    const asyncReviewCompletedState = {
      ...mockAsyncReview,
      grbReviewAsyncStatus: SystemIntakeGRBReviewAsyncStatusType.COMPLETED
    };

    renderComponent(asyncReviewCompletedState, false);

    // Hide restart review button
    expect(
      screen.queryByRole('button', { name: /restart review/i })
    ).not.toBeInTheDocument();
  });

  it('renders Completed state in Async reviews', () => {
    const asyncReviewCompletedState = {
      ...mockAsyncReview,
      grbReviewAsyncStatus: SystemIntakeGRBReviewAsyncStatusType.COMPLETED
    };

    renderComponent(asyncReviewCompletedState);

    expect(
      screen.queryByText(
        i18next.t<string>('grbReview:statusCard.restartReview')
      )
    ).toBeInTheDocument();
  });
});
