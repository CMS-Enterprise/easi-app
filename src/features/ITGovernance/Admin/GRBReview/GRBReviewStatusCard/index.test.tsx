import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  GRBVotingInformationStatus,
  SystemIntakeGRBReviewAsyncStatusType,
  SystemIntakeGRBReviewFragment,
  SystemIntakeGRBReviewStandardStatusType,
  SystemIntakeGRBReviewType,
  SystemIntakeStatusAdmin
} from 'gql/generated/graphql';
import i18next from 'i18next';
import { systemIntake } from 'tests/mock/systemIntake';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import { MessageProvider } from 'hooks/useMessage';

import { ModalProvider } from '../RestartReviewModal/RestartReviewModalContext';

import GRBReviewStatusCard from './index';

describe('GRBReviewStatusCard', () => {
  const mockStandardReview: SystemIntakeGRBReviewFragment = {
    __typename: 'SystemIntake',
    grbReviewType: SystemIntakeGRBReviewType.STANDARD,
    statusAdmin: SystemIntakeStatusAdmin.GRB_MEETING_READY,
    grbReviewAsyncStatus: null,
    grbReviewStandardStatus: SystemIntakeGRBReviewStandardStatusType.SCHEDULED,
    grbDate: '2050-03-28T12:00:00Z',
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
    statusAdmin: SystemIntakeStatusAdmin.GRB_REVIEW_IN_PROGRESS,
    grbReviewType: SystemIntakeGRBReviewType.ASYNC,
    grbReviewAsyncStatus: SystemIntakeGRBReviewAsyncStatusType.IN_PROGRESS,
    grbDate: null,
    grbReviewStartedAt: '2025-03-27T12:00:00Z',
    grbReviewAsyncEndDate: '2050-03-30T12:00:00Z',
    grbVotingInformation: {
      __typename: 'GRBVotingInformation',
      grbReviewers: [],
      numberOfNoObjection: 0,
      numberOfNotVoted: 0,
      numberOfObjection: 0,
      votingStatus: GRBVotingInformationStatus.IN_PROGRESS
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
                <GRBReviewStatusCard
                  systemIntakeId={systemIntake.id}
                  grbReview={grbReview}
                />
              </ITGovAdminContext.Provider>
            </ModalProvider>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );
  };

  describe('Standard meeting card', () => {
    it('renders the card', () => {
      const { asFragment } = renderComponent(mockStandardReview);

      // Check that the standard heading is rendered
      expect(
        screen.getByText(
          i18next.t<string>('grbReview:statusCard.heading', {
            context: 'STANDARD'
          })
        )
      ).toBeInTheDocument();

      // Check that the meeting date is displayed
      expect(screen.getByText('03/28/2050')).toBeInTheDocument();

      // Check that the "Change Meeting Date" button is displayed for ITGov admins
      expect(
        screen.getByText(
          i18next.t<string>('grbReview:statusCard.changeMeetingDate')
        )
      ).toBeInTheDocument();

      expect(asFragment()).toMatchSnapshot();
    });

    it('renders status: not started', () => {
      const reviewWithoutStartDate = {
        ...mockStandardReview,
        grbReviewStartedAt: null
      };

      renderComponent(reviewWithoutStartDate);

      expect(screen.getByTestId('async-status')).toHaveTextContent(
        'Not started'
      );

      expect(
        screen.getByRole('link', { name: 'Set up GRB review' })
      ).toBeInTheDocument();
    });

    it('renders status: complete if form was skipped', () => {
      const reviewWithoutStartDate = {
        ...mockStandardReview,
        grbReviewStandardStatus:
          SystemIntakeGRBReviewStandardStatusType.COMPLETED,
        grbReviewStartedAt: null
      };

      renderComponent(reviewWithoutStartDate);

      expect(screen.getByTestId('async-status')).toHaveTextContent('Complete');
    });
  });

  describe('Asynchronous review card', () => {
    it('renders the card', () => {
      renderComponent(mockAsyncReview);

      // Check that the async heading is rendered
      expect(
        screen.getByText(
          i18next.t<string>('grbReview:statusCard.heading', {
            context: 'ASYNC'
          })
        )
      ).toBeInTheDocument();

      // Check that the time remaining is displayed
      expect(
        screen.getByText(
          i18next.t<string>('grbReview:statusCard.timeRemaining')
        )
      ).toBeInTheDocument();
    });

    it('renders status: past due', () => {
      renderComponent({
        ...mockAsyncReview,
        grbReviewAsyncStatus: SystemIntakeGRBReviewAsyncStatusType.PAST_DUE,
        grbReviewAsyncEndDate: '2025-03-30T21:00:00Z'
      });

      expect(screen.getByTestId('async-status')).toHaveTextContent('Past due');
      expect(screen.getByText('Time past due')).toBeInTheDocument();
      expect(
        screen.getByText('Original end date: 03/30/2025, 5:00pm EST')
      ).toBeInTheDocument();
    });

    it('renders add time and end voting buttons (admin)', () => {
      renderComponent(mockAsyncReview);

      // Check that the Add Time or End Voting section is rendered
      expect(
        screen.getByText(i18next.t<string>('grbReview:statusCard.addTime'))
      ).toBeInTheDocument();

      expect(
        screen.getByText(i18next.t<string>('grbReview:statusCard.endVoting'))
      ).toBeInTheDocument();
    });

    it('renders restart review button if review is completed (admin)', () => {
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

    it('hides restart review button if user is not admin', () => {
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

    it('hides add time button if user is not admin', () => {
      renderComponent(mockAsyncReview, false);

      // Check that the Add Time or End Voting button is not displayed
      expect(
        screen.queryByText(i18next.t<string>('grbReview:statusCard.addTime'))
      ).not.toBeInTheDocument();
    });
  });
});
