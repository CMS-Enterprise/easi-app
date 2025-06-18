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

import GovTaskBizCaseFinal from '.';

describe('Gov Task: Submit your Business Case for final approval statuses', () => {
  function renderGovTaskBizCaseFinal(mockdata: ITGovTaskSystemIntake) {
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
    getByRoleWithNameTextKey('button', 'itGov:button.start');
  });

  it('In progress', () => {
    renderGovTaskBizCaseFinal(
      taskListState.bizCaseFinalInProgress.systemIntake!
    );
    // In progress
    expectTaskStatusTagToHaveTextKey('IN_PROGRESS');

    // Continue button
    getByRoleWithNameTextKey('button', 'itGov:button.continue');
  });

  it('Submitted', async () => {
    renderGovTaskBizCaseFinal(
      taskListState.bizCaseFinalSubmitted.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('SUBMITTED');

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

    // Edits requested warning
    expect(getExpectedAlertType('warning')).toHaveTextContent(
      i18next.t<string>(
        'itGov:taskList.step.bizCaseFinal.editsRequestedWarning'
      )
    );

    // Edit form button
    getByRoleWithNameTextKey('button', 'itGov:button.editForm');

    // View feedback link
    getByRoleWithNameTextKey('link', 'itGov:button.viewRequestedEdits');
  });

  it('Re-submitted', () => {
    renderGovTaskBizCaseFinal(
      taskListState.bizCaseFinalReSubmitted.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('SUBMITTED');

    // Submitted & waiting for feedback info
    expect(getExpectedAlertType('info')).toHaveTextContent(
      i18next.t<string>('itGov:taskList.step.bizCaseFinal.submittedInfo')
    );

    // View feedback + Submitted final biz case
    getByRoleWithNameTextKey('link', 'itGov:button.viewRequestedEdits');
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.bizCaseFinal.viewSubmittedFinalBusinessCase'
    );
  });

  it('Done - with feedback', () => {
    renderGovTaskBizCaseFinal(
      taskListState.bizCaseFinalDoneWithFeedback.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');

    // No alert
    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();

    // View feedback + Submitted draft biz case
    getByRoleWithNameTextKey('link', 'itGov:button.viewRequestedEdits');
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.bizCaseFinal.viewSubmittedFinalBusinessCase'
    );
  });

  it('Done - no feedback', async () => {
    renderGovTaskBizCaseFinal(
      taskListState.bizCaseFinalDoneNoFeedback.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');

    // No feedback info
    const noFeedbackInfo = getExpectedAlertType('info');
    const mailtoItGov = `mailto:${IT_GOV_EMAIL}`;
    expect(noFeedbackInfo).toContainHTML(
      await renderToStringWithData(
        <Trans
          i18nKey="itGov:taskList.step.bizCaseFinal.noFeedbackInfo"
          values={{
            email: IT_GOV_EMAIL
          }}
          components={{
            a: <Link href={mailtoItGov}> </Link>
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
      'itGov:taskList.step.bizCaseFinal.viewSubmittedFinalBusinessCase'
    );
  });
});
