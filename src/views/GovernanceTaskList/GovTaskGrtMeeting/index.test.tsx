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

import GovTaskGrtMeeting from '.';

describe('Gov Task: Attend the GRT meeting statuses', () => {
  function renderGovTaskGrtMeeting(mockdata: ItGovTaskSystemIntake) {
    return render(
      <MemoryRouter>
        <GovTaskGrtMeeting {...mockdata} />
      </MemoryRouter>
    );
  }

  it('Can’t start', () => {
    renderGovTaskGrtMeeting(taskListState.grtMeetingCantStart.systemIntake!);
    // Cannot start yet
    expectTaskStatusTagToHaveTextKey('CANT_START');
    // Link to prep grt meeting
    getByRoleWithNameTextKey('link', 'itGov:taskList.step.grtMeeting.link');
  });

  it('Skipped', () => {
    renderGovTaskGrtMeeting(taskListState.grtMeetingSkipped.systemIntake!);
    // Not needed
    expectTaskStatusTagToHaveTextKey('NOT_NEEDED');
    // Link to prep grt meeting
    getByRoleWithNameTextKey('link', 'itGov:taskList.step.grtMeeting.link');
  });

  it('In progress - not scheduled', () => {
    renderGovTaskGrtMeeting(
      taskListState.grtMeetingInProgressNotScheduled.systemIntake!
    );
    // Ready to schedule
    expectTaskStatusTagToHaveTextKey('READY_TO_SCHEDULE');
    // Button to prep grt meeting
    getByRoleWithNameTextKey('link', 'itGov:taskList.step.grtMeeting.button');
  });

  it('In progress - scheduled', () => {
    renderGovTaskGrtMeeting(
      taskListState.grtMeetingInProgressScheduled.systemIntake!
    );
    // Scheduled
    expectTaskStatusTagToHaveTextKey('SCHEDULED');
    // Meeting scheduled info
    expect(getExpectedAlertType('info')).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.grtMeeting.scheduledInfo', {
        date: 'July 17, 2023'
      })
    );
    // Button to prep grt meeting
    getByRoleWithNameTextKey('link', 'itGov:taskList.step.grtMeeting.button');
  });

  it('Done', () => {
    renderGovTaskGrtMeeting(taskListState.grtMeetingDone.systemIntake!);
    // Awaiting decision
    expectTaskStatusTagToHaveTextKey('AWAITING_DECISION');
    // Meeting attended info
    expect(getExpectedAlertType('info')).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.grtMeeting.attendedInfo', {
        date: 'July 17, 2023'
      })
    );
    // Link to prep grt meeting
    getByRoleWithNameTextKey('link', 'itGov:taskList.step.grtMeeting.link');
  });

  it('Done - decision with feedback', () => {
    renderGovTaskGrtMeeting(
      taskListState.grtMeetingDoneDecisionWithFeedback.systemIntake!
    );
    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');
    // Meeting attended info
    expect(getExpectedAlertType('info')).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.grtMeeting.attendedInfo', {
        date: 'July 17, 2023'
      })
    );

    // Link to prep grt meeting
    getByRoleWithNameTextKey('link', 'itGov:taskList.step.grtMeeting.link');
  });

  it('Done - decision without feedback', () => {
    renderGovTaskGrtMeeting(
      taskListState.grtMeetingDoneDecisionWithoutFeedback.systemIntake!
    );
    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');
    // Meeting attended info
    expect(getExpectedAlertType('info')).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.grtMeeting.attendedInfo', {
        date: 'July 17, 2023'
      })
    );
    // Link to prep grt meeting
    getByRoleWithNameTextKey('link', 'itGov:taskList.step.grtMeeting.link');
  });
});
