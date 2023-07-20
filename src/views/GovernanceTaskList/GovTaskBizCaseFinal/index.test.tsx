import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { taskListState } from 'data/mock/govTaskList';
import { ItGovTaskSystemIntake } from 'types/itGov';
import {
  expectTaskStatusTagToHaveTextKey,
  getByRoleWithNameTextKey,
  getExpectedAlertType
} from 'utils/testing/helpers';

import GovTaskBizCaseFinal from '.';

describe('Gov Task: Submit your Business Case for final approval statuses', () => {
  function renderGovTaskBizCaseFinal(mockdata: ItGovTaskSystemIntake) {
    return render(
      <MemoryRouter>
        <GovTaskBizCaseFinal {...mockdata} />
      </MemoryRouter>
    );
  }

  it('Can’t start', () => {
    renderGovTaskBizCaseFinal(
      taskListState.bizCaseFinalCantStart.systemIntake!
    );
    // Cannot yet start
    expectTaskStatusTagToHaveTextKey('CANT_START');
  });

  it('Skipped', () => {
    renderGovTaskBizCaseFinal(taskListState.bizCaseFinalSkipped.systemIntake!);
    // Not needed
    expectTaskStatusTagToHaveTextKey('NOT_NEEDED');
  });

  it('Not started', () => {
    renderGovTaskBizCaseFinal(
      taskListState.bizCaseFinalNotStarted.systemIntake!
    );
    // Ready to start
    expectTaskStatusTagToHaveTextKey('READY_TO_START');
    // Start button
    getByRoleWithNameTextKey('link', 'itGov:button.start');
  });

  it('In progress', () => {
    renderGovTaskBizCaseFinal(
      taskListState.bizCaseFinalInProgress.systemIntake!
    );
    // In progress
    expectTaskStatusTagToHaveTextKey('IN_PROGRESS');
    // % complete
    screen.getByText(
      i18next.t<string>('taskList:taskStatusInfo.percentComplete', {
        percent: 89
      })
    );
    // Continue button
    getByRoleWithNameTextKey('link', 'itGov:button.continue');
  });

  it('Submitted', async () => {
    renderGovTaskBizCaseFinal(
      taskListState.bizCaseFinalSubmitted.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');

    // Submitted date
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.submitted')}.*07/18/2023`
      )
    );

    // Submitted & waiting for feedback info
    expect(getExpectedAlertType('info')).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.bizCaseFinal.submittedInfo')
    );

    // View submitted final biz case link
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.bizCaseFinal.viewSubmittedFinalBusinessCase'
    );
  });

  it('Edits requested - from admins', () => {
    renderGovTaskBizCaseFinal(
      taskListState.bizCaseFinalEditsRequestedFromAdmins.systemIntake!
    );

    // Edits Requested
    expectTaskStatusTagToHaveTextKey('EDITS_REQUESTED');

    // Last updated date
    screen.getByText(
      RegExp(
        `${i18next.t<string>(
          'taskList:taskStatusInfo.lastUpdated'
        )}.*07/19/2023`
      )
    );

    // Edits requested warning
    expect(getExpectedAlertType('warning')).toHaveTextContent(
      i18next.t<string>(
        'itGov:taskList.step.bizCaseFinal.editsRequestedWarning'
      )
    );

    // Edit form button
    getByRoleWithNameTextKey('link', 'itGov:button.editForm');

    // View feedback link
    getByRoleWithNameTextKey('link', 'itGov:button.viewFeedback');
  });

  it('Re-submitted', () => {
    renderGovTaskBizCaseFinal(
      taskListState.bizCaseFinalReSubmitted.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');

    // Submitted date
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.submitted')}.*07/20/2023`
      )
    );

    // Submitted & waiting for feedback info
    expect(getExpectedAlertType('info')).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.bizCaseFinal.submittedInfo')
    );

    // View feedback + Submitted final biz case
    getByRoleWithNameTextKey('link', 'itGov:button.viewFeedback');
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.bizCaseFinal.viewSubmittedFinalBusinessCase'
    );
  });
});
