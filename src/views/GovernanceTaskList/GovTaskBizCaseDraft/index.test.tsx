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

import GovTaskBizCaseDraft from '.';

describe('Gov Task: Prepare a draft Business Case statuses', () => {
  function renderGovTaskBizCaseDraft(mockdata: ItGovTaskSystemIntake) {
    return render(
      <MemoryRouter>
        <GovTaskBizCaseDraft {...mockdata} />
      </MemoryRouter>
    );
  }

  it('Can’t start', () => {
    renderGovTaskBizCaseDraft(
      taskListState.bizCaseDraftCantStart.systemIntake!
    );
    // Cannot yet start
    expectTaskStatusTagToHaveTextKey('CANT_START');
  });

  it('Skipped', () => {
    renderGovTaskBizCaseDraft(taskListState.bizCaseDraftSkipped.systemIntake!);
    // Not needed
    expectTaskStatusTagToHaveTextKey('NOT_NEEDED');
  });

  it('Not started', () => {
    renderGovTaskBizCaseDraft(
      taskListState.bizCaseDraftNotStarted.systemIntake!
    );
    // Ready to start
    expectTaskStatusTagToHaveTextKey('READY_TO_START');
    // Start button
    getByRoleWithNameTextKey('link', 'itGov:button.start');
  });

  it('In progress', () => {
    renderGovTaskBizCaseDraft(
      taskListState.bizCaseDraftInProgress.systemIntake!
    );
    // In progress
    expectTaskStatusTagToHaveTextKey('IN_PROGRESS');
    // Last updated date
    screen.getByText(
      RegExp(
        `${i18next.t<string>(
          'taskList:taskStatusInfo.lastUpdated'
        )}.*07/12/2023`
      )
    );
    // Continue button
    getByRoleWithNameTextKey('link', 'itGov:button.continue');
  });

  it('Submitted', async () => {
    renderGovTaskBizCaseDraft(
      taskListState.bizCaseDraftSubmitted.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');

    // Submitted date
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.submitted')}.*07/13/2023`
      )
    );

    /* TODO: EASI-3110 verify that this is correct mock data for all instances */
    // // Submitted & waiting for feedback info
    // expect(getExpectedAlertType('info')).toHaveTextContent(
    //   i18next.t<string>('itGov:taskList.step.bizCaseDraft.submittedInfo')
    // );

    // View submitted draft biz case link
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.bizCaseDraft.viewSubmittedDraftBusinessCase'
    );
  });

  it('Edits requested - from admins', () => {
    renderGovTaskBizCaseDraft(
      taskListState.bizCaseDraftEditsRequestedFromAdmins.systemIntake!
    );

    // Edits Requested
    expectTaskStatusTagToHaveTextKey('EDITS_REQUESTED');

    // Last updated date
    screen.getByText(
      RegExp(
        `${i18next.t<string>(
          'taskList:taskStatusInfo.lastUpdated'
        )}.*07/14/2023`
      )
    );

    // Edits requested warning
    expect(getExpectedAlertType('warning')).toHaveTextContent(
      i18next.t<string>(
        'itGov:taskList.step.bizCaseDraft.editsRequestedWarning'
      )
    );

    // Edit form button
    getByRoleWithNameTextKey('link', 'itGov:button.editForm');

    // View feedback link
    getByRoleWithNameTextKey('link', 'itGov:button.viewFeedback');
  });

  it('Re-submitted', () => {
    renderGovTaskBizCaseDraft(
      taskListState.bizCaseDraftReSubmitted.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');

    // Submitted date
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.submitted')}.*07/15/2023`
      )
    );

    /* TODO: EASI-3110 verify that this is correct mock data for all instances */
    // // Submitted & waiting for feedback info
    // expect(getExpectedAlertType('info')).toHaveTextContent(
    //   i18next.t<string>('itGov:taskList.step.bizCaseDraft.submittedInfo')
    // );

    // View feedback + Submitted draft biz case
    getByRoleWithNameTextKey('link', 'itGov:button.viewFeedback');
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.bizCaseDraft.viewSubmittedDraftBusinessCase'
    );
  });
});
