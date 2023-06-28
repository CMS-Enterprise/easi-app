import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import i18next from 'i18next';

import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import GovernanceTaskList from '.';

describe('Governance Task List', () => {
  const id = '80950153-4a66-4881-b728-f4cc701ff926';

  it('renders a request task list at the initial state', async () => {
    const { getByRole, getByTestId } = render(
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
                    id,
                    itGovTaskStatuses: {
                      intakeFormStatus: 'READY',
                      feedbackFromInitialReviewStatus: 'CANT_START',
                      decisionAndNextStepsStatus: 'CANT_START',
                      bizCaseDraftStatus: 'CANT_START',
                      grtMeetingStatus: 'CANT_START',
                      bizCaseFinalStatus: 'CANT_START',
                      grbMeetingStatus: 'CANT_START',
                      __typename: 'ITGovTaskStatuses'
                    },
                    __typename: 'SystemIntake'
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

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    // Header
    await getByRole('heading', {
      level: 1,
      name: i18next.t<string>('itGov:taskList.heading')
    });

    // Crumb back to it gov home
    expect(
      getByRole('link', {
        name: i18next.t<string>('itGov:itGovernance')
      })
    ).toHaveAttribute('href', '/system/making-a-request');

    // Sidebar back to home
    expect(
      getByRole('link', {
        name: i18next.t<string>('itGov:button.saveAndExit')
      })
    ).toHaveAttribute('href', '/system/making-a-request');

    // First task list item
    getByRole('heading', {
      level: 3,
      name: i18next.t<string>('itGov:taskList.steps.0.title')
    });

    // The task list initial state is: Step 1: Ready to start
    const step1 = getByTestId('fill-out-the-intake-request-form');
    expect(within(step1).getByTestId('task-list-task-tag')).toHaveTextContent(
      i18next.t<string>('taskList:taskStatus.READY')
    );

    // Step 1: Ready to start should show the Start button
    within(step1).getByRole('link', {
      name: i18next.t<string>('itGov:button.start')
    });
  });
});
