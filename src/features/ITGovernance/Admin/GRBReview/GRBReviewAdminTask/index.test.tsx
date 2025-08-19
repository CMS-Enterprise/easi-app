import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  SendSystemIntakeGRBReviewerReminderDocument,
  SendSystemIntakeGRBReviewerReminderMutation,
  SystemIntakeGRBReviewerVotingRole
} from 'gql/generated/graphql';
import i18next from 'i18next';
import { grbReviewers } from 'tests/mock/grbReview';
import { systemIntake } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import { formatDateLocal, formatTimeLocal } from 'utils/date';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import '@testing-library/jest-dom';

import GRBReviewAdminTask from './index';

describe('GRBReviewAdminTask', () => {
  describe('Send review reminder', () => {
    let user: ReturnType<typeof userEvent.setup>;
    beforeEach(() => {
      user = userEvent.setup();
    });
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

      await user.click(
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

    it('clears error message on modal close', async () => {
      const sendReminderMutation: MockedQuery<SendSystemIntakeGRBReviewerReminderMutation> =
        {
          request: {
            query: SendSystemIntakeGRBReviewerReminderDocument,
            variables: {
              systemIntakeID: systemIntake.id
            }
          },
          error: new Error()
        };

      render(
        <MemoryRouter>
          <VerboseMockedProvider mocks={[sendReminderMutation]}>
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

      const adminAction = screen.getByTestId('grb-review-admin-task');

      const openModalButton = within(adminAction).getByRole('button', {
        name: 'Send reminder'
      });

      // Open send remindermodal

      await user.click(openModalButton);

      const modal = await screen.findByRole('dialog');

      const sendReminderButton = within(modal).getByRole('button', {
        name: 'Send reminder'
      });

      // Check that clicking the send reminder button shows an error message

      await user.click(sendReminderButton);

      expect(await screen.findByTestId('alert')).toHaveTextContent(
        'There was an issue sending your reminder.'
      );

      // Close modal

      await user.click(
        screen.getByRole('button', { name: 'Go back without sending' })
      );

      expect(modal).not.toBeInTheDocument();

      // Open modal and check that error message has been cleared

      await user.click(openModalButton);

      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });
  });
});
