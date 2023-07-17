import React from 'react';
import { Trans } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { renderToStringWithData } from '@apollo/client/react/ssr';
import { render, screen, within } from '@testing-library/react';
import { Link } from '@trussworks/react-uswds';
import i18next from 'i18next';

import { IT_GOV_EMAIL } from 'constants/externalUrls';
import { taskListState } from 'data/mock/govTaskList';
import { ItGovTaskSystemIntake } from 'types/itGov';
import {
  expectTaskStatusTagToHaveTextKey,
  getByRoleWithNameTextKey,
  getExpectedAlertType
} from 'utils/testing/helpers';

import GovTaskFeedbackFromInitialReview from '.';

describe('Gov Task: Feedback from initial review statuses', () => {
  function renderGovTaskFeedbackFromInitialReview(
    mockdata: ItGovTaskSystemIntake
  ) {
    return render(
      <MemoryRouter>
        <GovTaskFeedbackFromInitialReview {...mockdata} />
      </MemoryRouter>
    );
  }

  it('Can’t start', () => {
    renderGovTaskFeedbackFromInitialReview(
      taskListState.feedbackFromInitialReviewCantStart.systemIntake!
    );

    // Cannot yet start
    expectTaskStatusTagToHaveTextKey('CANT_START');

    // Feedback info
    expect(getExpectedAlertType('info')).toContainHTML(
      i18next.t<string>(
        'itGov:taskList.step.feedbackFromInitialReview.reviewInfo'
      )
    );
  });

  it('In progress', () => {
    renderGovTaskFeedbackFromInitialReview(
      taskListState.feedbackFromInitialReviewInProgress.systemIntake!
    );

    // In review
    expectTaskStatusTagToHaveTextKey('IN_REVIEW');

    // Feedback info
    expect(getExpectedAlertType('info')).toContainHTML(
      i18next.t<string>(
        'itGov:taskList.step.feedbackFromInitialReview.reviewInfo'
      )
    );
  });

  it('Done - no feedback', async () => {
    renderGovTaskFeedbackFromInitialReview(
      taskListState.feedbackFromInitialReviewDoneNoFeedback.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');

    // No feedback info
    const noFeedbackInfo = getExpectedAlertType('info');
    const mailtoItGov = `mailto:${IT_GOV_EMAIL}`;
    expect(noFeedbackInfo).toContainHTML(
      await renderToStringWithData(
        <Trans
          i18nKey="itGov:taskList.step.feedbackFromInitialReview.noFeedbackInfo"
          components={{
            a: <Link href={mailtoItGov}> </Link>,
            email: IT_GOV_EMAIL
          }}
        />
      )
    );

    // Email within info
    expect(
      within(noFeedbackInfo).getByRole('link', { name: IT_GOV_EMAIL })
    ).toHaveAttribute('href', mailtoItGov);

    // Completed date
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.completed')}.*07/10/2023`
      )
    );
  });

  it('Done - with feedback', () => {
    renderGovTaskFeedbackFromInitialReview(
      taskListState.feedbackFromInitialReviewDoneWithFeedback.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');

    // No alert
    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();

    // View feedback
    getByRoleWithNameTextKey('link', 'itGov:button.viewFeedback');

    // Completed date
    screen.getByText(
      RegExp(
        `${i18next.t<string>('taskList:taskStatusInfo.completed')}.*07/10/2023`
      )
    );
  });

  it('Re-submitted with feedback', () => {
    renderGovTaskFeedbackFromInitialReview(
      taskListState.feedbackFromInitialReviewResubmittedWithFeedback
        .systemIntake!
    );

    // In review
    expectTaskStatusTagToHaveTextKey('IN_REVIEW');

    // Feedback info
    getExpectedAlertType('info');

    // View feedback
    getByRoleWithNameTextKey('link', 'itGov:button.viewFeedback');
  });
});
