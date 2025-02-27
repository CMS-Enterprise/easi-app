import React from 'react';
import { Trans } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { renderToStringWithData } from '@apollo/client/react/ssr';
import { render, screen } from '@testing-library/react';
import { Link } from '@trussworks/react-uswds';
import i18next from 'i18next';
import { taskListState } from 'tests/mock/govTaskList';

import { IT_GOV_EMAIL } from 'constants/externalUrls';
import { ITGovTaskSystemIntake } from 'types/itGov';
import {
  expectTaskStatusTagToHaveTextKey,
  getByRoleWithNameTextKey,
  getExpectedAlertType
} from 'utils/testing/helpers';

import GovTaskBizCaseDraft from '.';

describe('Gov Task: Prepare a draft Business Case statuses', () => {
  function renderGovTaskBizCaseDraft(mockdata: ITGovTaskSystemIntake) {
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
    getByRoleWithNameTextKey('button', 'itGov:button.start');
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
    getByRoleWithNameTextKey('button', 'itGov:button.continue');
  });

  it('Submitted', async () => {
    renderGovTaskBizCaseDraft(
      taskListState.bizCaseDraftSubmitted.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('SUBMITTED');

    // Submitted date
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.submitted')}.*07/13/2023`
      )
    );

    // Submitted & waiting for feedback info
    expect(getExpectedAlertType('info')).toHaveTextContent(
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
    getByRoleWithNameTextKey('button', 'itGov:button.editForm');

    // View feedback link
    getByRoleWithNameTextKey('link', 'itGov:button.viewRequestedEdits');
  });

  it('Re-submitted', () => {
    renderGovTaskBizCaseDraft(
      taskListState.bizCaseDraftReSubmitted.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('SUBMITTED');

    // Submitted date
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.submitted')}.*07/15/2023`
      )
    );

    // Submitted & waiting for feedback info
    expect(getExpectedAlertType('info')).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.bizCaseDraft.submittedInfo')
    );

    // View feedback + Submitted draft biz case
    getByRoleWithNameTextKey('link', 'itGov:button.viewRequestedEdits');
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.bizCaseDraft.viewSubmittedDraftBusinessCase'
    );
  });

  it('Done - with feedback', () => {
    renderGovTaskBizCaseDraft(
      taskListState.bizCaseDraftDoneWithFeedback.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');

    // Submitted date
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.submitted')}.*07/16/2023`
      )
    );

    // No alert
    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();

    // View feedback + Submitted draft biz case
    getByRoleWithNameTextKey('link', 'itGov:button.viewRequestedEdits');
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.bizCaseDraft.viewSubmittedDraftBusinessCase'
    );
  });

  it('Done - no feedback', async () => {
    renderGovTaskBizCaseDraft(
      taskListState.bizCaseDraftDoneNoFeedback.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');

    // Submitted date
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.submitted')}.*07/16/2023`
      )
    );

    // No feedback info
    const noFeedbackInfo = getExpectedAlertType('info');
    const mailtoItGov = `mailto:${IT_GOV_EMAIL}`;
    expect(noFeedbackInfo).toContainHTML(
      await renderToStringWithData(
        <Trans
          i18nKey="itGov:taskList.step.bizCaseDraft.noFeedbackInfo"
          components={{
            a: <Link href={mailtoItGov}> </Link>,
            email: IT_GOV_EMAIL
          }}
        />
      )
    );

    // No View feedback link
    expect(
      screen.queryByRole('link', {
        name: i18next.t<string>('itGov:button.viewRequestedEdits')
      })
    ).not.toBeInTheDocument();

    // Submitted draft biz case
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.bizCaseDraft.viewSubmittedDraftBusinessCase'
    );
  });
});
