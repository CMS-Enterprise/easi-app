import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import i18next from 'i18next';

import {
  intakeFormEditsRequested,
  intakeFormInProgress,
  intakeFormNotStarted,
  intakeFormResubmittedAfterEdits,
  intakeFormSubmitted
} from 'data/mock/govTaskList';
import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import GovernanceTaskList, { GovTaskIntakeForm } from '.';

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
                    itGovTaskStatuses: intakeFormNotStarted,
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
      name: i18next.t<string>('itGov:taskList.step.intakeForm.title')
    });
  });
});

describe('Gov Task Statuses', () => {
  describe('Fill out the Intake Request form', () => {
    it('not started', () => {
      const { getByRole, getByTestId } = render(
        <MemoryRouter>
          <GovTaskIntakeForm itGovTaskStatuses={intakeFormNotStarted} />
        </MemoryRouter>
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
      const { getByRole, getByTestId } = render(
        <MemoryRouter>
          <GovTaskIntakeForm itGovTaskStatuses={intakeFormInProgress} />
        </MemoryRouter>
      );

      // In progress
      expect(getByTestId('task-list-task-tag')).toHaveTextContent(
        i18next.t<string>('taskList:taskStatus.IN_PROGRESS')
      );

      // - % complete

      // Continue button
      getByRole('link', {
        name: i18next.t<string>('itGov:button.continue')
      });
    });

    it('submitted', () => {
      const { getByTestId } = render(
        <GovTaskIntakeForm itGovTaskStatuses={intakeFormSubmitted} />
      );

      // Completed
      expect(getByTestId('task-list-task-tag')).toHaveTextContent(
        i18next.t<string>('taskList:taskStatus.COMPLETED')
      );

      // - link: View submitted request form
      // - Submitted MM/DD/YYYY
    });

    it('edits requested', () => {
      const { getByRole, getByTestId } = render(
        <MemoryRouter>
          <GovTaskIntakeForm itGovTaskStatuses={intakeFormEditsRequested} />
        </MemoryRouter>
      );

      // Edits requested
      expect(getByTestId('task-list-task-tag')).toHaveTextContent(
        i18next.t<string>('taskList:taskStatus.EDITS_REQUESTED')
      );

      // Edit form button
      getByRole('link', {
        name: i18next.t<string>('itGov:button.editForm')
      });

      // - alert warn
      // - link: View feedback
      // - Last updated MM/DD/YYYY
    });

    it('resubmitted after edits', () => {
      render(
        <GovTaskIntakeForm
          itGovTaskStatuses={intakeFormResubmittedAfterEdits}
        />
      );

      // - View feedback + View submitted request form
      // - meta: Submitted MM/DD/YYYY
    });
  });
});
