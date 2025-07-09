import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SystemIntakeGRBReviewType } from 'gql/generated/graphql';
import { getSystemIntakeGRBDiscussionsQuery } from 'tests/mock/discussions';
import { taskListState } from 'tests/mock/govTaskList';
import { getSystemIntakeGRBReviewQuery } from 'tests/mock/grbReview';
import { grbPresentationLinks } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { ITGovTaskSystemIntake } from 'types/itGov';
import easiMockStore from 'utils/testing/easiMockStore';
import { expectTaskStatusTagToHaveTextKey } from 'utils/testing/helpers';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import GovTaskGrbMeeting from '.';

const store = easiMockStore({ groups: ['EASI_P_USER'] });

describe('Gov Task: Attend the GRB meeting statuses', () => {
  function renderGovTaskGrbMeeting(mockdata: ITGovTaskSystemIntake) {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <VerboseMockedProvider
            mocks={[
              getSystemIntakeGRBDiscussionsQuery(),
              getSystemIntakeGRBReviewQuery()
            ]}
          >
            <MessageProvider>
              <GovTaskGrbMeeting {...mockdata} />
            </MessageProvider>
          </VerboseMockedProvider>
        </MemoryRouter>
      </Provider>
    );
  }

  describe('Standard GRB Meeting', () => {
    it('Cannot start yet', () => {
      renderGovTaskGrbMeeting(taskListState.grbMeetingCantStart.systemIntake!);

      // Cannot start yet
      expectTaskStatusTagToHaveTextKey('CANT_START');

      // Hides review type and status alert
      expect(screen.queryByTestId('review-type')).toBeNull();
      expect(screen.queryByTestId('review-status-alert')).toBeNull();

      // Hides presentation deck
      expect(screen.queryByTestId('presentation-deck-container')).toBeNull();

      // Hides discussions card
      expect(screen.queryByTestId('requester-discussions-card')).toBeNull();
    });

    it('Not needed', () => {
      renderGovTaskGrbMeeting(taskListState.grbMeetingSkipped.systemIntake!);

      // Not needed
      expectTaskStatusTagToHaveTextKey('NOT_NEEDED');

      // Hides review type and status alert
      expect(screen.queryByTestId('review-type')).toBeNull();
      expect(screen.queryByTestId('review-status-alert')).toBeNull();

      // Hides presentation deck
      expect(screen.queryByTestId('presentation-deck-container')).toBeNull();

      // Hides discussions card
      expect(screen.queryByTestId('requester-discussions-card')).toBeNull();
    });

    it('Ready to schedule', () => {
      renderGovTaskGrbMeeting(
        taskListState.grbMeetingInProgressNotScheduled.systemIntake!
      );

      // Ready to schedule
      expectTaskStatusTagToHaveTextKey('READY_TO_SCHEDULE');

      // Review type and status alert
      expect(screen.getByTestId('review-type')).toHaveTextContent(
        'Standard GRB meeting'
      );
      expect(screen.getByTestId('review-status-alert')).toHaveTextContent(
        'The Governance Admin Team will schedule a GRB review.'
      );

      // Renders presentation deck
      expect(
        screen.getByTestId('presentation-deck-container')
      ).toBeInTheDocument();

      // Renders discussions card
      expect(
        screen.getByTestId('requester-discussions-card')
      ).toBeInTheDocument();
    });

    it('Scheduled', () => {
      renderGovTaskGrbMeeting(
        taskListState.grbMeetingInProgressScheduled.systemIntake!
      );

      // Scheduled
      expectTaskStatusTagToHaveTextKey('SCHEDULED');

      // Review type and status alert
      expect(screen.getByTestId('review-type')).toBeInTheDocument();
      expect(screen.getByTestId('review-status-alert')).toHaveTextContent(
        'GRB meeting scheduled for 07/20/2023'
      );

      // Renders presentation deck
      expect(
        screen.getByTestId('presentation-deck-container')
      ).toBeInTheDocument();

      // Renders discussions card
      expect(
        screen.getByTestId('requester-discussions-card')
      ).toBeInTheDocument();
    });

    it('Awaiting decision', () => {
      renderGovTaskGrbMeeting(
        taskListState.grbMeetingAwaitingDecision.systemIntake!
      );

      // Awaiting decision
      expectTaskStatusTagToHaveTextKey('AWAITING_DECISION');

      // Review type and status alert
      expect(screen.getByTestId('review-type')).toBeInTheDocument();
      expect(screen.getByTestId('review-status-alert')).toHaveTextContent(
        'You attended the GRB meeting on 07/20/2023'
      );

      // Hides presentation deck
      expect(screen.queryByTestId('presentation-deck-container')).toBeNull();

      // Renders discussions card
      expect(
        screen.getByTestId('requester-discussions-card')
      ).toBeInTheDocument();
    });

    it('Completed', () => {
      renderGovTaskGrbMeeting(
        taskListState.decisionAndNextStepsInProgress.systemIntake!
      );

      // Completed
      expectTaskStatusTagToHaveTextKey('COMPLETED');

      // Review type and status alert
      expect(screen.getByTestId('review-type')).toBeInTheDocument();
      expect(screen.getByTestId('review-status-alert')).toHaveTextContent(
        'You attended the GRB meeting on 08/02/2023'
      );

      // Hides presentation deck
      expect(screen.queryByTestId('presentation-deck-container')).toBeNull();

      // Hides discussions card
      expect(screen.queryByTestId('requester-discussions-card')).toBeNull();
    });
  });

  describe('Async GRB Meeting', () => {
    it('Cannot start yet', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingCantStart.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC
      };
      renderGovTaskGrbMeeting(modifiedMock);

      // Cannot start yet
      expectTaskStatusTagToHaveTextKey('CANT_START');

      // Hides review type and status alert
      expect(screen.queryByTestId('review-type')).toBeNull();
      expect(screen.queryByTestId('review-status-alert')).toBeNull();

      // Hides presentation deck
      expect(screen.queryByTestId('presentation-deck-container')).toBeNull();

      // Hides discussions card
      expect(screen.queryByTestId('requester-discussions-card')).toBeNull();
    });

    it('Not needed', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingSkipped.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC
      };
      renderGovTaskGrbMeeting(modifiedMock);

      // Not needed
      expectTaskStatusTagToHaveTextKey('NOT_NEEDED');

      // Hides review type and status alert
      expect(screen.queryByTestId('review-type')).toBeNull();
      expect(screen.queryByTestId('review-status-alert')).toBeNull();

      // Hides presentation deck
      expect(screen.queryByTestId('presentation-deck-container')).toBeNull();

      // Hides discussions card
      expect(screen.queryByTestId('requester-discussions-card')).toBeNull();
    });

    it('Ready to schedule (with presentation deck)', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingInProgressNotScheduled.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC,
        grbPresentationLinks
      };
      renderGovTaskGrbMeeting(modifiedMock);

      // Ready to schedule
      expectTaskStatusTagToHaveTextKey('READY_TO_SCHEDULE');

      // Renders review type and status alert
      expect(screen.getByTestId('review-type')).toHaveTextContent(
        'Asynchronous'
      );
      expect(screen.getByTestId('review-status-alert')).toHaveTextContent(
        'The Governance Admin Team will schedule a time to record your presentation.'
      );

      // Renders presentation deck
      expect(
        screen.getByTestId('presentation-deck-container')
      ).toBeInTheDocument();

      // Renders discussions card
      expect(
        screen.getByTestId('requester-discussions-card')
      ).toBeInTheDocument();

      // Prep for GRB review - renders as button if presentation deck is uploaded
      expect(
        screen.getByRole('link', { name: 'Prepare for the GRB review' })
      ).toHaveClass('usa-button');
    });

    it('Ready to schedule (without presentation deck)', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingInProgressNotScheduled.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC,
        grbPresentationLinks: null
      };
      renderGovTaskGrbMeeting(modifiedMock);

      // Prep for GRB review - renders as link if presentation deck is NOT uploaded
      expect(
        screen.getByRole('link', { name: 'Prepare for the GRB review' })
      ).not.toHaveClass('usa-button');
    });

    it('Scheduled', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingInProgressScheduled.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC
      };

      renderGovTaskGrbMeeting(modifiedMock);

      // Scheduled
      expectTaskStatusTagToHaveTextKey('SCHEDULED');

      // Renders review type and status alert
      expect(screen.getByTestId('review-type')).toBeInTheDocument();
      expect(screen.getByTestId('review-status-alert')).toHaveTextContent(
        'Your presentation recording session is scheduled for 07/20/2023.'
      );

      // Renders presentation deck
      expect(
        screen.getByTestId('presentation-deck-container')
      ).toBeInTheDocument();

      // Renders discussions card
      expect(
        screen.getByTestId('requester-discussions-card')
      ).toBeInTheDocument();
    });

    it('Awaiting GRB review', () => {
      renderGovTaskGrbMeeting(
        taskListState.grbMeetingInProgressAwaitingGrbReview.systemIntake!
      );

      // Awaiting GRB review
      expectTaskStatusTagToHaveTextKey('AWAITING_GRB_REVIEW');

      // Renders review type and status alert
      expect(screen.getByTestId('review-type')).toBeInTheDocument();
      expect(screen.getByTestId('review-status-alert')).toHaveTextContent(
        'You attended the presentation recording session on 06/02/2023.'
      );

      // Renders presentation deck
      expect(
        screen.getByTestId('presentation-deck-container')
      ).toBeInTheDocument();

      // Renders discussions card
      expect(
        screen.getByTestId('requester-discussions-card')
      ).toBeInTheDocument();
    });

    it('Review in progress', () => {
      renderGovTaskGrbMeeting(
        taskListState.grbMeetingReviewInProgress.systemIntake!
      );

      // Review in progress
      expectTaskStatusTagToHaveTextKey('REVIEW_IN_PROGRESS');

      // Renders review type and status alert
      expect(screen.getByTestId('review-type')).toBeInTheDocument();
      expect(screen.getByTestId('review-status-alert')).toHaveTextContent(
        'This asynchronous review is from 06/02/2023 to 07/20/2023.'
      );

      // Renders presentation deck
      expect(
        screen.getByTestId('presentation-deck-container')
      ).toBeInTheDocument();

      // Renders discussions card
      expect(
        screen.getByTestId('requester-discussions-card')
      ).toBeInTheDocument();
    });

    it('Awaiting decision', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingAwaitingDecision.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC
      };

      renderGovTaskGrbMeeting(modifiedMock);

      expectTaskStatusTagToHaveTextKey('AWAITING_DECISION');

      // Renders review type and status alert
      expect(screen.getByTestId('review-type')).toBeInTheDocument();
      expect(screen.getByTestId('review-status-alert')).toHaveTextContent(
        'This GRB review ended on 07/20/2023.'
      );

      // Hides presentation deck
      expect(screen.queryByTestId('presentation-deck-container')).toBeNull();

      // Renders discussions card
      expect(
        screen.getByTestId('requester-discussions-card')
      ).toBeInTheDocument();
    });

    it('Awaiting decision (ended manually)', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingAwaitingDecision.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC,
        grbReviewAsyncManualEndDate: '2025-06-02T00:00:00'
      };

      renderGovTaskGrbMeeting(modifiedMock);

      // Displays manual end date
      expect(screen.getByTestId('review-status-alert')).toHaveTextContent(
        'This GRB review ended on 06/02/2025.'
      );
    });

    it('Completed', () => {
      const modifiedMock = {
        ...taskListState.decisionAndNextStepsInProgress.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC
      };
      renderGovTaskGrbMeeting(modifiedMock);

      // Awaiting decision
      expectTaskStatusTagToHaveTextKey('COMPLETED');

      // Renders review type and status alert
      expect(screen.getByTestId('review-type')).toBeInTheDocument();
      expect(screen.getByTestId('review-status-alert')).toHaveTextContent(
        'This GRB review ended on 08/02/2023.'
      );

      // Hides presentation deck
      expect(screen.queryByTestId('presentation-deck-container')).toBeNull();

      // Hides discussions card
      expect(screen.queryByTestId('requester-discussions-card')).toBeNull();
    });
  });

  describe('Review types modal', () => {
    it('opens and closes the modal', async () => {
      renderGovTaskGrbMeeting(
        taskListState.grbMeetingInProgressNotScheduled.systemIntake!
      );

      // Click the Learn more button
      userEvent.click(
        screen.getByRole('button', {
          name: 'Learn more about the GRB review types'
        })
      );

      // Expect Modal to pop up
      const modalTitle = screen.queryByRole('heading', {
        name: 'GRB review types'
      });

      expect(modalTitle).toBeInTheDocument();

      // Click the Go back button
      userEvent.click(
        screen.getByRole('button', { name: 'Go back to task list' })
      );

      // Expect Modal to close
      expect(modalTitle).not.toBeInTheDocument();
    });
  });
});
