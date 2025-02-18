import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { taskListState } from 'tests/mock/govTaskList';

import { ItGovTaskSystemIntake } from 'types/itGov';
import {
  expectTaskStatusTagToHaveTextKey,
  getByRoleWithNameTextKey,
  getExpectedAlertType
} from 'utils/testing/helpers';

import GovTaskIntakeForm from '.';

describe('Gov Task: Fill out the Intake Request form statuses', () => {
  function renderGovTaskIntakeForm(mockdata: ItGovTaskSystemIntake) {
    return render(
      <MemoryRouter>
        <GovTaskIntakeForm {...mockdata} />
      </MemoryRouter>
    );
  }

  it('not started', () => {
    renderGovTaskIntakeForm(taskListState.intakeFormNotStarted.systemIntake!);

    // Ready to start
    expectTaskStatusTagToHaveTextKey('READY');

    // Start button
    getByRoleWithNameTextKey('button', 'itGov:button.start');
  });

  it('in progress', () => {
    renderGovTaskIntakeForm(taskListState.intakeFormInProgress.systemIntake!);

    // In progress
    expectTaskStatusTagToHaveTextKey('IN_PROGRESS');

    // % complete
    screen.getByText(
      i18next.t<string>('taskList:taskStatusInfo.percentComplete', {
        percent: 22
      })
    );

    // Continue button
    getByRoleWithNameTextKey('button', 'itGov:button.continue');
  });

  it('submitted', () => {
    renderGovTaskIntakeForm(taskListState.intakeFormSubmitted.systemIntake!);

    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');

    // Submitted MM/DD/YYYY
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.submitted')}.*07/07/2023`
      )
    );

    // View submitted request form
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.intakeForm.viewSubmittedRequestForm'
    );
  });

  it('edits requested', () => {
    renderGovTaskIntakeForm(
      taskListState.intakeFormEditsRequested.systemIntake!
    );

    // Edits requested
    expectTaskStatusTagToHaveTextKey('EDITS_REQUESTED');

    // Edit form button
    getByRoleWithNameTextKey('button', 'itGov:button.editForm');

    // Edits requested warning
    expect(getExpectedAlertType('warning')).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.intakeForm.editsRequestedWarning')
    );

    // View feedback
    getByRoleWithNameTextKey('link', 'itGov:button.viewRequestedEdits');

    // View submitted request form should not exist
    expect(
      screen.queryByRole('link', {
        name: i18next.t<string>(
          'itGov:taskList.step.intakeForm.viewSubmittedRequestForm'
        )
      })
    ).not.toBeInTheDocument();

    // Last updated MM/DD/YYYY
    screen.getByText(
      RegExp(
        `${i18next.t<string>(
          'taskList:taskStatusInfo.lastUpdated'
        )}.*07/08/2023`
      )
    );
  });

  it('resubmitted after edits', () => {
    renderGovTaskIntakeForm(
      taskListState.intakeFormResubmittedAfterEdits.systemIntake!
    );

    // View feedback + View submitted request form
    getByRoleWithNameTextKey('link', 'itGov:button.viewRequestedEdits');
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.intakeForm.viewSubmittedRequestForm'
    );

    // Submitted MM/DD/YYYY
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.submitted')}.*07/09/2023`
      )
    );
  });
});
