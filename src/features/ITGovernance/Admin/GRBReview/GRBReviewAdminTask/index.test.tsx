import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SystemIntakeGRBReviewerVotingRole } from 'gql/generated/graphql';
import i18next from 'i18next';
import { grbReviewers } from 'tests/mock/grbReview';
import { systemIntake } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { formatDateLocal, formatTimeLocal } from 'utils/date';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import '@testing-library/jest-dom';

import GRBReviewAdminTask from './index';

describe('GRBReviewAdminTask', () => {
  describe('Send review reminder', () => {
    it('renders the task with no previous reminder sent', async () => {
      render(
        <MemoryRouter>
          <VerboseMockedProvider>
            <MessageProvider>
              <GRBReviewAdminTask
                systemIntakeId={systemIntake.id}
                grbReviewStartedAt="2025-05-08T14:00:39.089005Z"
                grbReviewReminderLastSent={null}
                grbReviewers={[]}
                isITGovAdmin
              />
            </MessageProvider>
          </VerboseMockedProvider>
        </MemoryRouter>
      );

      expect(
        screen.getByRole('heading', { name: 'Send review reminder' })
      ).toBeInTheDocument();

      expect(screen.queryByTestId('review-reminder')).not.toBeInTheDocument();
    });

    it('displays the date and time of last reminder sent', async () => {
      const grbReviewReminderLastSent = '2025-05-09T14:00:39.089005Z';

      render(
        <MemoryRouter>
          <VerboseMockedProvider>
            <MessageProvider>
              <GRBReviewAdminTask
                systemIntakeId={systemIntake.id}
                grbReviewStartedAt="2025-05-08T14:00:39.089005Z"
                grbReviewReminderLastSent={grbReviewReminderLastSent}
                grbReviewers={[]}
                isITGovAdmin
              />
            </MessageProvider>
          </VerboseMockedProvider>
        </MemoryRouter>
      );

      expect(
        screen.getByRole('heading', { name: 'Send review reminder' })
      ).toBeInTheDocument();

      const previousReminderText = i18next.t<string>(
        'grbReview:adminTask.sendReviewReminder.mostRecentReminder',
        {
          date: formatDateLocal(grbReviewReminderLastSent, 'MM/dd/yyyy'),
          time: formatTimeLocal(grbReviewReminderLastSent)
        }
      );

      expect(screen.getByTestId('review-reminder')).toHaveTextContent(
        previousReminderText
      );
    });

    it('opens the modal with correct number of reviewers', async () => {
      render(
        <MemoryRouter>
          <VerboseMockedProvider>
            <MessageProvider>
              <GRBReviewAdminTask
                systemIntakeId={systemIntake.id}
                grbReviewStartedAt="2025-05-08T14:00:39.089005Z"
                grbReviewReminderLastSent="2025-05-09T14:00:39.089005Z"
                grbReviewers={grbReviewers}
                isITGovAdmin
              />
            </MessageProvider>
          </VerboseMockedProvider>
        </MemoryRouter>
      );

      userEvent.click(
        screen.getByRole('button', {
          name: 'Send reminder'
        })
      );

      /* Check that modal text displays correct number of reviewers */

      const votingReviewers = grbReviewers.filter(
        reviewer =>
          reviewer.votingRole === SystemIntakeGRBReviewerVotingRole.VOTING
      );

      const reviewersNotVoted = votingReviewers.filter(
        reviewer => !reviewer.vote
      );

      const modalText = await screen.findByText(
        `Sending this reminder will send a notification email to the ${reviewersNotVoted.length} out of ${votingReviewers.length} Governance Review Board (GRB) voting members who have not yet added a vote for this request.`,
        { exact: false }
      );

      expect(modalText).toBeInTheDocument();
    });
  });
});
