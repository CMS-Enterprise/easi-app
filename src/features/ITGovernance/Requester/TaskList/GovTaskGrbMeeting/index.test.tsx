import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { taskListState } from 'tests/mock/govTaskList';

import { SystemIntakeGRBReviewType } from 'types/graphql-global-types';
import { ItGovTaskSystemIntake } from 'types/itGov';
import {
  expectTaskStatusTagToHaveTextKey,
  getByRoleWithNameTextKey,
  getExpectedAlertType
} from 'utils/testing/helpers';

import GovTaskGrbMeeting from '.';

describe('Gov Task: Attend the GRB review statuses', () => {
  function renderGovTaskGrbMeeting(mockdata: ItGovTaskSystemIntake) {
    return render(
      <MemoryRouter>
        <GovTaskGrbMeeting {...mockdata} />
      </MemoryRouter>
    );
  }

  describe('Standard GRB Meeting', () => {
    it('Can’t start', () => {
      renderGovTaskGrbMeeting(taskListState.grbMeetingCantStart.systemIntake!);
      // Cannot start yet
      expectTaskStatusTagToHaveTextKey('CANT_START');
      // Link to prep grb meeting
      getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.button');
    });

    it('Skipped', () => {
      renderGovTaskGrbMeeting(taskListState.grbMeetingSkipped.systemIntake!);
      // Not needed
      expectTaskStatusTagToHaveTextKey('NOT_NEEDED');
      // Link to prep grb meeting
      getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.button');
    });

    it('In progress - not scheduled', () => {
      renderGovTaskGrbMeeting(
        taskListState.grbMeetingInProgressNotScheduled.systemIntake!
      );
      // Ready to schedule
      expectTaskStatusTagToHaveTextKey('READY_TO_SCHEDULE');
      // Button to prep grb meeting
      getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.button');
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
      getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.button');
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
      getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.button');
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
      getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.button');
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
      getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.button');
    });

    it('In progress - not scheduled', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingInProgressNotScheduled.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC
      };
      renderGovTaskGrbMeeting(modifiedMock);

      // Ready to schedule
      expectTaskStatusTagToHaveTextKey('READY_TO_SCHEDULE');
      // Button to prep grb meeting
      getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.button');
    });

    it('In progress - scheduled', () => {
      const modifiedMock = {
        ...taskListState.grbMeetingInProgressScheduled.systemIntake!,
        grbReviewType: SystemIntakeGRBReviewType.ASYNC
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
      getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.button');
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
      getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.button');
    });
  });
});
