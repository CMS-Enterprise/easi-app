import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import i18next from 'i18next';

import { taskListState } from 'data/mock/govTaskList';
import { ItGovTaskSystemIntake } from 'types/itGov';

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
    const { getByTestId } = renderGovTaskFeedbackFromInitialReview(
      taskListState.feedbackFromInitialReviewCantStart.systemIntake!
    );

    // Cannot yet start
    expect(getByTestId('task-list-task-tag')).toHaveTextContent(
      i18next.t<string>('taskList:taskStatus.CANT_START')
    );

    // Feedback info
    const reviewInfo = getByTestId('alert');
    expect(reviewInfo).toHaveClass('usa-alert--info');
    // expect(reviewInfo).toHaveTextContent(
    //   i18next.t<string>(
    //     'itGov:taskList.step.feedbackFromInitialReview.reviewInfo'
    //   )
    // );
  });

  it('In progress', () => {
    const { getByTestId } = renderGovTaskFeedbackFromInitialReview(
      taskListState.feedbackFromInitialReviewInProgress.systemIntake!
    );

    // In review
    expect(getByTestId('task-list-task-tag')).toHaveTextContent(
      i18next.t<string>('taskList:taskStatus.IN_REVIEW')
    );

    // Feedback info
    const reviewInfo = getByTestId('alert');
    expect(reviewInfo).toHaveClass('usa-alert--info');
    // expect(reviewInfo).toHaveTextContent(
    //   i18next.t<string>(
    //     'itGov:taskList.step.feedbackFromInitialReview.reviewInfo'
    //   )
    // );
  });

  it('Done - no feedback', () => {
    const { getByTestId } = renderGovTaskFeedbackFromInitialReview(
      taskListState.feedbackFromInitialReviewDoneNoFeedback.systemIntake!
    );

    // Completed
    expect(getByTestId('task-list-task-tag')).toHaveTextContent(
      i18next.t<string>('taskList:taskStatus.COMPLETED')
    );

    // No feedback info
    const reviewInfo = getByTestId('alert');
    expect(reviewInfo).toHaveClass('usa-alert--info');
    // expect(reviewInfo).toHaveTextContent(
    //   i18next.t<string>(
    //     'itGov:taskList.step.feedbackFromInitialReview.noFeedbackInfo'
    //   )
    // );

    // - completed date
  });

  it('Done - with feedback', () => {
    const {
      getByTestId,
      getByRole,
      queryByTestId
    } = renderGovTaskFeedbackFromInitialReview(
      taskListState.feedbackFromInitialReviewDoneWithFeedback.systemIntake!
    );

    // Completed
    expect(getByTestId('task-list-task-tag')).toHaveTextContent(
      i18next.t<string>('taskList:taskStatus.COMPLETED')
    );

    // No alert
    expect(queryByTestId('alert')).not.toBeInTheDocument();

    // View feedback
    getByRole('link', {
      name: i18next.t<string>('itGov:button.viewFeedback')
    });

    // - completed date
  });

  it('Re-submitted with feedback', () => {
    const { getByTestId, getByRole } = renderGovTaskFeedbackFromInitialReview(
      taskListState.feedbackFromInitialReviewResubmittedWithFeedback
        .systemIntake!
    );

    // In review
    expect(getByTestId('task-list-task-tag')).toHaveTextContent(
      i18next.t<string>('taskList:taskStatus.IN_REVIEW')
    );

    // Feedback info
    const reviewInfo = getByTestId('alert');
    expect(reviewInfo).toHaveClass('usa-alert--info');

    // View feedback
    getByRole('link', {
      name: i18next.t<string>('itGov:button.viewFeedback')
    });
  });
});
