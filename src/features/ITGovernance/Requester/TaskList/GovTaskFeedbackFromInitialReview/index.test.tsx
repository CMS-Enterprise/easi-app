import React from 'react';
import { Trans } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { renderToStringWithData } from '@apollo/client/react/ssr';
import { render, screen, within } from '@testing-library/react';
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

import GovTaskFeedbackFromInitialReview from '.';

describe('Gov Task: Feedback from initial review statuses', () => {
  function renderGovTaskFeedbackFromInitialReview(
    mockdata: ITGovTaskSystemIntake
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
          values={{
            email: IT_GOV_EMAIL
          }}
          components={{
            a: <Link href={mailtoItGov}> </Link>
          }}
        />
      )
    );

    // Email within info
    expect(
      within(noFeedbackInfo).getByRole('link', { name: IT_GOV_EMAIL })
    ).toHaveAttribute('href', mailtoItGov);
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
    getByRoleWithNameTextKey('link', 'itGov:button.viewRequestedEdits');
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
    getByRoleWithNameTextKey('link', 'itGov:button.viewRequestedEdits');
  });
});
