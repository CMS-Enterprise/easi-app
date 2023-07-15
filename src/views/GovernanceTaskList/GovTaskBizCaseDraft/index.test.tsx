import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ByRoleMatcher, render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { TaskStatus } from 'components/shared/TaskStatusTag';
import { taskListState } from 'data/mock/govTaskList';
import { ItGovTaskSystemIntake } from 'types/itGov';
import fnErrorCapture from 'utils/fnErrorCapture';

import GovTaskBizCaseDraft from '.';

const expectTaskStatusTagToHaveStatusText = fnErrorCapture(
  (taskStatus: TaskStatus) => {
    expect(screen.getByTestId('task-list-task-tag')).toHaveTextContent(
      i18next.t<string>(`taskList:taskStatus.${taskStatus}`)
    );
  }
);

const getByRoleWithNameTextKey = fnErrorCapture(
  (role: ByRoleMatcher, nameTextKey: string) => {
    return screen.getByRole(role, {
      name: i18next.t<string>(nameTextKey)
    });
  }
);

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
    expectTaskStatusTagToHaveStatusText('CANT_START');
  });

  it('Skipped', () => {
    renderGovTaskBizCaseDraft(taskListState.bizCaseDraftSkipped.systemIntake!);
    // Not needed
    expectTaskStatusTagToHaveStatusText('NOT_NEEDED');
  });

  it('Not started', () => {
    renderGovTaskBizCaseDraft(
      taskListState.bizCaseDraftNotStarted.systemIntake!
    );
    // Ready to start
    expectTaskStatusTagToHaveStatusText('READY_TO_START');
    // Start button
    getByRoleWithNameTextKey('link', 'itGov:button.start');
  });

  it('In progress', () => {
    renderGovTaskBizCaseDraft(
      taskListState.bizCaseDraftInProgress.systemIntake!
    );
    // In progress
    expectTaskStatusTagToHaveStatusText('IN_PROGRESS');
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
    expectTaskStatusTagToHaveStatusText('COMPLETED');

    // Submitted date
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.submitted')}.*07/13/2023`
      )
    );

    // Submitted & waiting for feedback info
    const submittedInfo = screen.getByTestId('alert');
    expect(submittedInfo).toHaveClass('usa-alert--info');
    expect(submittedInfo).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.bizCaseDraft.submittedInfo')
    );

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
    expectTaskStatusTagToHaveStatusText('EDITS_REQUESTED');

    // Last updated date
    screen.getByText(
      RegExp(
        `${i18next.t<string>(
          'taskList:taskStatusInfo.lastUpdated'
        )}.*07/14/2023`
      )
    );

    // Edits requested warning
    const submittedInfo = screen.getByTestId('alert');
    expect(submittedInfo).toHaveClass('usa-alert--warning');
    expect(submittedInfo).toHaveTextContent(
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
    expectTaskStatusTagToHaveStatusText('COMPLETED');

    // Submitted date
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.submitted')}.*07/15/2023`
      )
    );

    // Submitted & waiting for feedback info
    const submittedInfo = screen.getByTestId('alert');
    expect(submittedInfo).toHaveClass('usa-alert--info');
    expect(submittedInfo).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.bizCaseDraft.submittedInfo')
    );

    // View feedback + Submitted draft biz case
    getByRoleWithNameTextKey('link', 'itGov:button.viewFeedback');
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.bizCaseDraft.viewSubmittedDraftBusinessCase'
    );
  });
});
