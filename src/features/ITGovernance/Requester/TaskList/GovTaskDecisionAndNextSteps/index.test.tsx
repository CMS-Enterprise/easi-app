import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { taskListState } from 'tests/mock/govTaskList';

import { ITGovTaskSystemIntake } from 'types/itGov';
import {
  expectTaskStatusTagToHaveTextKey,
  getByRoleWithNameTextKey
} from 'utils/testing/helpers';

import GovTaskDecisionAndNextSteps from '.';

describe('Gov Task: Decision and next steps statuses', () => {
  function renderGovTaskDecisionAndNextSteps(mockdata: ITGovTaskSystemIntake) {
    return render(
      <MemoryRouter>
        <GovTaskDecisionAndNextSteps {...mockdata} />
      </MemoryRouter>
    );
  }

  it('cant start', () => {
    renderGovTaskDecisionAndNextSteps(
      taskListState.decisionAndNextStepsCantStart.systemIntake!
    );
    // Cannot start yet
    expectTaskStatusTagToHaveTextKey('CANT_START');
  });

  it('in progress', () => {
    renderGovTaskDecisionAndNextSteps(
      taskListState.decisionAndNextStepsInProgress.systemIntake!
    );
    // Awaiting decision
    expectTaskStatusTagToHaveTextKey('IN_REVIEW');
  });

  it('done', () => {
    renderGovTaskDecisionAndNextSteps(
      taskListState.decisionAndNextStepsDone.systemIntake!
    );

    // Completed
    expectTaskStatusTagToHaveTextKey('COMPLETED');

    // Decision and next steps button
    getByRoleWithNameTextKey(
      'link',
      'itGov:taskList.step.decisionAndNextSteps.button'
    );
  });
});
