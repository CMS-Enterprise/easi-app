import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import i18next from 'i18next';

import { taskListState } from 'data/mock/govTaskList';
import {
  getGovernanceTaskListQuery,
  systemIntake
} from 'data/mock/systemIntake';
import { SystemIntakeState } from 'types/graphql-global-types';
import { getByRoleWithNameTextKey } from 'utils/testing/helpers';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import GovernanceTaskList from '.';

describe('Governance Task List', () => {
  const { id } = systemIntake;

  it('renders a request task list at the initial state', async () => {
    render(
      <MemoryRouter initialEntries={[`/governance-task-list/${id}`]}>
        <VerboseMockedProvider
          mocks={[
            getGovernanceTaskListQuery(
              taskListState.intakeFormNotStarted.systemIntake
            )
          ]}
        >
          <Route path="/governance-task-list/:systemId">
            <GovernanceTaskList />
          </Route>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    // Header
    screen.getByRole('heading', {
      level: 1,
      name: i18next.t<string>('itGov:taskList.heading')
    });

    // Crumb back to it gov home
    expect(
      getByRoleWithNameTextKey('link', 'itGov:itGovernance')
    ).toHaveAttribute('href', '/system/making-a-request');

    // Sidebar back to home
    expect(
      getByRoleWithNameTextKey('link', 'itGov:button.saveAndExit')
    ).toHaveAttribute('href', '/system/making-a-request');

    // First task list item
    screen.getByRole('heading', {
      level: 3,
      name: i18next.t<string>('itGov:taskList.step.intakeForm.title')
    });
  });

  it('renders alert and disables buttons if request is closed', async () => {
    render(
      <MemoryRouter initialEntries={[`/governance-task-list/${id}`]}>
        <VerboseMockedProvider
          mocks={[
            getGovernanceTaskListQuery({
              ...taskListState.intakeFormNotStarted.systemIntake,
              state: SystemIntakeState.CLOSED
            })
          ]}
        >
          <Route path="/governance-task-list/:systemId">
            <GovernanceTaskList />
          </Route>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(screen.getByTestId('closed-alert')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Start' })).toBeDisabled();
  });

  it('renders alert when decision has been made', async () => {
    render(
      <MemoryRouter initialEntries={[`/governance-task-list/${id}`]}>
        <VerboseMockedProvider
          mocks={[
            getGovernanceTaskListQuery(
              taskListState.decisionAndNextStepsDone.systemIntake
            )
          ]}
        >
          <Route path="/governance-task-list/:systemId">
            <GovernanceTaskList />
          </Route>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(screen.getByTestId('decision-alert')).toBeInTheDocument();

    // If decision has been made, closed alert should not be displayed
    expect(screen.queryByTestId('closed-alert')).toBeNull();
  });
});
