import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { taskListState } from 'data/mock/govTaskList';
import { ItGovTaskSystemIntake } from 'types/itGov';

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
    const { getByRole, getByTestId } = renderGovTaskIntakeForm(
      taskListState.intakeFormNotStarted.systemIntake!
    );

    // Ready to start
    expect(getByTestId('task-list-task-tag')).toHaveTextContent(
      i18next.t<string>('taskList:taskStatus.READY')
    );

    // Start button
    getByRole('link', {
      name: i18next.t<string>('itGov:button.start')
    });
  });

  it('in progress', () => {
    const { getByRole, getByTestId } = renderGovTaskIntakeForm(
      taskListState.intakeFormInProgress.systemIntake!
    );

    // In progress
    expect(getByTestId('task-list-task-tag')).toHaveTextContent(
      i18next.t<string>('taskList:taskStatus.IN_PROGRESS')
    );

    // % complete
    screen.getByText(
      i18next.t<string>('taskList:taskStatusInfo.percentComplete', {
        percent: 22
      })
    );

    // Continue button
    getByRole('link', {
      name: i18next.t<string>('itGov:button.continue')
    });
  });

  it('submitted', () => {
    const { getByRole, getByText, getByTestId } = renderGovTaskIntakeForm(
      taskListState.intakeFormSubmitted.systemIntake!
    );

    // Completed
    expect(getByTestId('task-list-task-tag')).toHaveTextContent(
      i18next.t<string>('taskList:taskStatus.COMPLETED')
    );

    // Submitted MM/DD/YYYY
    getByText(RegExp(i18next.t<string>('taskList:taskStatusInfo.submitted')));
    getByText(RegExp('07/07/2023'));

    // View submitted request form
    getByRole('link', {
      name: i18next.t<string>(
        'itGov:taskList.step.intakeForm.viewSubmittedRequestForm'
      )
    });
  });

  it('edits requested', () => {
    const {
      getByRole,
      getByTestId,
      getByText,
      queryByRole
    } = renderGovTaskIntakeForm(
      taskListState.intakeFormEditsRequested.systemIntake!
    );

    // Edits requested
    expect(getByTestId('task-list-task-tag')).toHaveTextContent(
      i18next.t<string>('taskList:taskStatus.EDITS_REQUESTED')
    );

    // Edit form button
    getByRole('link', {
      name: i18next.t<string>('itGov:button.editForm')
    });

    // Edits requested warning
    const alertWarning = getByTestId('alert');
    expect(alertWarning).toHaveClass('usa-alert--warning');
    expect(alertWarning).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.intakeForm.editsRequestedWarning')
    );

    // View feedback
    getByRole('link', {
      name: i18next.t<string>('itGov:button.viewFeedback')
    });

    // View submitted request form should not exist
    expect(
      queryByRole('link', {
        name: i18next.t<string>(
          'itGov:taskList.step.intakeForm.viewSubmittedRequestForm'
        )
      })
    ).not.toBeInTheDocument();

    // Last updated MM/DD/YYYY
    getByText(RegExp(i18next.t<string>('taskList:taskStatusInfo.lastUpdated')));
    getByText(RegExp('07/08/2023'));
  });

  it('resubmitted after edits', () => {
    const { getByRole, getByText } = renderGovTaskIntakeForm(
      taskListState.intakeFormResubmittedAfterEdits.systemIntake!
    );

    // View feedback + View submitted request form
    getByRole('link', {
      name: i18next.t<string>('itGov:button.viewFeedback')
    });

    getByRole('link', {
      name: i18next.t<string>(
        'itGov:taskList.step.intakeForm.viewSubmittedRequestForm'
      )
    });

    // Submitted MM/DD/YYYY
    getByText(RegExp(i18next.t<string>('taskList:taskStatusInfo.submitted')));
    getByText(RegExp('07/09/2023'));
  });
});
