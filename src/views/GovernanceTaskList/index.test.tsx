import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import i18next from 'i18next';

import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
// eslint-disable-next-line camelcase
import { GetGovernanceTaskList_systemIntake_itGovTaskStatuses } from 'queries/types/GetGovernanceTaskList';
import {
  ITGovDecisionStatus,
  ITGovDraftBusinessCaseStatus,
  ITGovFeedbackStatus,
  ITGovFinalBusinessCaseStatus,
  ITGovGRBStatus,
  ITGovGRTStatus,
  ITGovIntakeFormStatus
} from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import GovernanceTaskList from '.';

describe('Governance Task List', () => {
  const id = '80950153-4a66-4881-b728-f4cc701ff926';

  // eslint-disable-next-line camelcase
  const requesterStartsNewRequest: GetGovernanceTaskList_systemIntake_itGovTaskStatuses = {
    intakeFormStatus: ITGovIntakeFormStatus.READY,
    feedbackFromInitialReviewStatus: ITGovFeedbackStatus.CANT_START,
    decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
    bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
    grtMeetingStatus: ITGovGRTStatus.CANT_START,
    bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
    grbMeetingStatus: ITGovGRBStatus.CANT_START,
    __typename: 'ITGovTaskStatuses'
  };

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
                    itGovTaskStatuses: requesterStartsNewRequest,
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
  });
});
