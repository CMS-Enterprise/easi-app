import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import i18next from 'i18next';

import { taskListState } from 'data/mock/govTaskList';
import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import { getByRoleWithNameTextKey } from 'utils/testing/helpers';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import GovernanceTaskList from '.';

describe('Governance Task List', () => {
  const id = '80950153-4a66-4881-b728-f4cc701ff926';

  it('renders a request task list at the initial state', async () => {
    render(
      <MemoryRouter initialEntries={[`/governance-task-list/${id}`]}>
        <VerboseMockedProvider
          mocks={[
            {
              request: {
                query: GetGovernanceTaskListQuery,
                variables: {
                  id
                }
              },
              result: {
                data: {
                  systemIntake: {
                    ...taskListState.intakeFormNotStarted.systemIntake,
                    id
                  }
                }
              }
            }
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
});
