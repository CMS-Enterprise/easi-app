import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import i18next from 'i18next';

import { taskListState } from 'data/mock/govTaskList';
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

  it('Can’t start', () => {
    renderGovTaskGrbMeeting(taskListState.grbMeetingCantStart.systemIntake!);
    // Cannot start yet
    expectTaskStatusTagToHaveTextKey('CANT_START');
    // Link to prep grb meeting
    getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.link');
  });

  it('Skipped', () => {
    renderGovTaskGrbMeeting(taskListState.grbMeetingSkipped.systemIntake!);
    // Not needed
    expectTaskStatusTagToHaveTextKey('NOT_NEEDED');
    // Link to prep grb meeting
    getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.link');
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
      i18next.t<string>('itGov:taskList.step.grbMeeting.scheduledInfo', {
        date: 'July 20, 2023'
      })
    );
    // Button to prep grb meeting
    getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.button');
  });

  it('Done', () => {
    renderGovTaskGrbMeeting(taskListState.grbMeetingDone.systemIntake!);
    // Awaiting decision
    expectTaskStatusTagToHaveTextKey('COMPLETED');
    // Meeting attended info
    expect(getExpectedAlertType('info')).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.grbMeeting.attendedInfo', {
        date: 'July 20, 2023'
      })
    );
    // Link to prep grb meeting
    getByRoleWithNameTextKey('link', 'itGov:taskList.step.grbMeeting.link');
  });
});
