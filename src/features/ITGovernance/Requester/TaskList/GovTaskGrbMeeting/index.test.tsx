import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  SystemIntakeDocumentStatus,
  SystemIntakeGRBReviewType
} from 'gql/generated/graphql';
import i18next from 'i18next';
import { taskListState } from 'tests/mock/govTaskList';
import { grbPresentationLinks } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import { ITGovTaskSystemIntake } from 'types/itGov';
import {
  expectTaskStatusTagToHaveTextKey,
  getExpectedAlertType
} from 'utils/testing/helpers';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import GovTaskGrbMeeting from '.';

describe('Gov Task: Attend the GRB meeting statuses', () => {
  function renderGovTaskGrbMeeting(mockdata: ITGovTaskSystemIntake) {
    return render(
      <MemoryRouter>
        <VerboseMockedProvider>
          <MessageProvider>
            <GovTaskGrbMeeting {...mockdata} />
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );
  }

  describe('Standard GRB Meeting', () => {
    it('Can’t start', () => {
      renderGovTaskGrbMeeting(taskListState.grbMeetingCantStart.systemIntake!);
      // Cannot start yet
      expectTaskStatusTagToHaveTextKey('CANT_START');

      // Link to prep grb meeting
      expect(
        screen.getByRole('link', { name: 'Prepare for the GRB review' })
      ).not.toHaveClass('usa-button');
    });

    it('Skipped', () => {
      renderGovTaskGrbMeeting(taskListState.grbMeetingSkipped.systemIntake!);
      // Not needed
      expectTaskStatusTagToHaveTextKey('NOT_NEEDED');

      // Link to prep grb meeting
      expect(
        screen.getByRole('link', { name: 'Prepare for the GRB review' })
      ).not.toHaveClass('usa-button');
    });

    it('In progress - not scheduled', () => {
      renderGovTaskGrbMeeting(
        taskListState.grbMeetingInProgressNotScheduled.systemIntake!
      );
      // Ready to schedule
      expectTaskStatusTagToHaveTextKey('READY_TO_SCHEDULE');

      // Button to prep grb meeting
      expect(
        screen.getByRole('link', { name: 'Prepare for the GRB review' })
      ).toHaveClass('usa-button');
    });

    it('In progress - scheduled', () => {
      renderGovTaskGrbMeeting(
        taskListState.grbMeetingInProgressScheduled.systemIntake!
      );
      // Scheduled
      expectTaskStatusTagToHaveTextKey('SCHEDULED');
      // Meeting scheduled info
      expect(getExpectedAlertType('info')).toHaveTextContent(
        i18next.t<string>(
          'itGov:taskList.step.grbMeeting.alertType.STANDARD.SCHEDULED',
          {
            date: '07/20/2023'
          }
        )
      );
      expect(
        screen.getByText(
          i18next.t<string>(
            `itGov:taskList.step.grbMeeting.reviewType.STANDARD`
          )
        )
      ).toBeInTheDocument();

      // Button to prep grb meeting
      expect(
        screen.getByRole('link', { name: 'Prepare for the GRB review' })
      ).toHaveClass('usa-button');
    });

    it('Done', () => {
      renderGovTaskGrbMeeting(taskListState.grbMeetingDone.systemIntake!);
      // Awaiting decision
      expectTaskStatusTagToHaveTextKey('COMPLETED');
      // Meeting attended info
      expect(getExpectedAlertType('info')).toHaveTextContent(
        i18next.t<string>(
          'itGov:taskList.step.grbMeeting.alertType.STANDARD.COMPLETED',
          {
            date: '07/20/2023'
          }
        )
      );

      // Link to prep grb meeting
      expect(
        screen.getByRole('link', { name: 'Prepare for the GRB review' })
      ).not.toHaveClass('usa-button');
    });
  });

  describe('Async GRB Meeting', () => {
    it('Can’t start', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingCantStart.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC
      };
      renderGovTaskGrbMeeting(modifiedMock);

      // Cannot start yet
      expectTaskStatusTagToHaveTextKey('CANT_START');

      // Link to prep grb meeting
      expect(
        screen.getByRole('link', { name: 'Prepare for the GRB review' })
      ).not.toHaveClass('usa-button');
    });

    it('Skipped', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingSkipped.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC
      };
      renderGovTaskGrbMeeting(modifiedMock);

      // Not needed
      expectTaskStatusTagToHaveTextKey('NOT_NEEDED');

      // Link to prep grb meeting
      expect(
        screen.getByRole('link', { name: 'Prepare for the GRB review' })
      ).not.toHaveClass('usa-button');
    });

    it('In progress - not scheduled', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingInProgressNotScheduled.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC,
        grbPresentationLinks
      };
      renderGovTaskGrbMeeting(modifiedMock);

      // Ready to schedule
      expectTaskStatusTagToHaveTextKey('READY_TO_SCHEDULE');

      // Button to prep grb meeting
      expect(
        screen.getByRole('link', { name: 'Prepare for the GRB review' })
      ).toHaveClass('usa-button');
    });

    it('In progress - scheduled', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingInProgressScheduled.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC,
        grbPresentationLinks
      };
      renderGovTaskGrbMeeting(modifiedMock);

      // Scheduled
      expectTaskStatusTagToHaveTextKey('SCHEDULED');

      // Meeting scheduled info
      expect(getExpectedAlertType('info')).toHaveTextContent(
        i18next.t<string>(
          'itGov:taskList.step.grbMeeting.alertType.ASYNC.SCHEDULED',
          {
            date: '07/20/2023'
          }
        )
      );

      // Button to prep grb meeting
      expect(
        screen.getByRole('link', { name: 'Prepare for the GRB review' })
      ).toHaveClass('usa-button');
    });

    it('Done', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingDone.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC
      };
      renderGovTaskGrbMeeting(modifiedMock);

      // Awaiting decision
      expectTaskStatusTagToHaveTextKey('COMPLETED');
      // Meeting attended info
      expect(getExpectedAlertType('info')).toHaveTextContent(
        i18next.t<string>(
          'itGov:taskList.step.grbMeeting.alertType.ASYNC.COMPLETED',
          {
            date: '07/20/2023'
          }
        )
      );

      // Link to prep grb meeting
      expect(
        screen.getByRole('link', { name: 'Prepare for the GRB review' })
      ).not.toHaveClass('usa-button');
    });
  });

  describe('Presentation deck', () => {
    it('displays document scanning', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingInProgressNotScheduled.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC,
        grbPresentationLinks: {
          __typename: 'SystemIntakeGRBPresentationLinks' as const,
          presentationDeckFileStatus: SystemIntakeDocumentStatus.PENDING
        }
      };
      renderGovTaskGrbMeeting(modifiedMock);

      expect(
        screen.getByText(
          i18next.t<string>('itGov:taskList.step.grbMeeting.scanning')
        )
      ).toBeInTheDocument();
    });

    it('displays the correct presentation file name and buttons work', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingInProgressNotScheduled.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC,
        grbPresentationLinks
      };
      renderGovTaskGrbMeeting(modifiedMock);

      expect(
        screen.queryByText(
          i18next.t<string>('itGov:taskList.step.grbMeeting.scanning')
        )
      ).not.toBeInTheDocument();

      expect(
        screen.getByText(/Uploaded presentation deck:/i)
      ).toBeInTheDocument();

      // Ensure the filename appears
      expect(
        screen.getByText(grbPresentationLinks.presentationDeckFileName!)
      ).toBeInTheDocument();

      // Check the "View" link is present with correct URL
      const links = screen.getAllByRole('link', { name: /View/i });
      const correctLink = links.find(
        link =>
          link.getAttribute('href') ===
          grbPresentationLinks.presentationDeckFileURL
      );

      expect(correctLink).toBeInTheDocument();

      // Ensure the "Remove" button exists
      expect(
        screen.getByRole('button', { name: /Remove/i })
      ).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /Remove/i }));

      // Expect Modal to pop up
      expect(
        screen.getByText(
          i18next.t<string>('itGov:taskList.step.grbMeeting.removeModal.title')
        )
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: /Remove presentation/i })
      ).toBeInTheDocument();
    });
  });

  describe('Review types modal', () => {
    it('opens and closes the modal', async () => {
      renderGovTaskGrbMeeting(
        taskListState.grbMeetingInProgressNotScheduled.systemIntake!
      );

      // Click the Learn more button
      fireEvent.click(
        screen.getByText(
          i18next.t<string>('itGov:taskList.step.grbMeeting.learnMore')
        )
      );

      // Expect Modal to pop up
      const modalTitle = screen.queryByRole('heading', {
        name: 'GRB review types'
      });

      expect(modalTitle).toBeInTheDocument();

      // Click the Go back button
      fireEvent.click(
        screen.getByText(
          i18next.t<string>(
            'itGov:taskList.step.grbMeeting.reviewTypeModal.goBack'
          )
        )
      );

      // Expect Modal to close
      expect(modalTitle).not.toBeInTheDocument();
    });
  });
});
