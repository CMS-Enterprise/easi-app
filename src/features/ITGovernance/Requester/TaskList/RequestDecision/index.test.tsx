import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  SystemIntakeDecisionState,
  SystemIntakeTRBFollowUp
} from 'gql/generated/graphql';
import i18next from 'i18next';
import { getSystemIntakeQuery, systemIntake } from 'tests/mock/systemIntake';

import { MessageProvider } from 'hooks/useMessage';
import easiMockStore from 'utils/testing/easiMockStore';
import { getByRoleWithNameTextKey } from 'utils/testing/helpers';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import RequestDecision from './index';

describe('RequestDecision', () => {
  const store = easiMockStore();
  const routeFor = (id: string) => `/governance-task-list/${id}/next-steps`;
  const routePath = '/governance-task-list/:systemId/next-steps';
  const { id } = systemIntake;

  const renderWith = (mocks: any[]) =>
    render(
      <MemoryRouter initialEntries={[routeFor(id)]}>
        <VerboseMockedProvider mocks={mocks}>
          <Provider store={store}>
            <MessageProvider>
              <Route path={routePath}>
                <RequestDecision />
              </Route>
            </MessageProvider>
          </Provider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

  it('Renders LCID_ISSUED', async () => {
    renderWith([
      getSystemIntakeQuery({
        ...systemIntake,
        id,
        decisionState: SystemIntakeDecisionState.LCID_ISSUED,
        decisionNextSteps: 'Do the thing',
        decidedAt: '2025-09-29T12:00:00Z',
        trbFollowUpRecommendation:
          SystemIntakeTRBFollowUp.RECOMMENDED_BUT_NOT_CRITICAL
      })
    ]);

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    screen.getByRole('heading', {
      level: 1,
      name: i18next.t<string>('taskList:navigation.nextSteps')
    });

    // PDF buttons (top & bottom)
    const pdfButtons = screen.getAllByRole('button', {
      name: i18next.t<string>('taskList:decisionNextSteps.downloadPDF')
    });
    expect(pdfButtons.length).toBeGreaterThanOrEqual(2);

    // "Next steps" section present
    screen.getByRole('heading', {
      level: 2,
      name: i18next.t<string>('taskList:decision.nextSteps')
    });

    // LCID ISSUED banner on top
    screen.getByText(
      i18next.t<string>(
        'governanceReviewTeam:decision.requesterDecisionState_LCID_ISSUED'
      )
    );

    // Rich text displays provided steps
    screen.getByText('Do the thing');

    // TRB CTA button
    screen.getByRole('button', {
      name: i18next.t<string>('technicalAssistance:breadcrumbs.startTrbRequest')
    });

    // Update System Profile section -- only for LCID_ISSUED state
    screen.getByRole('heading', {
      level: 3,
      name: i18next.t<string>('taskList:decision.updateSystemProfile.heading')
    });
  });

  it('Renders  NOT_GOVERNANCE', async () => {
    renderWith([
      getSystemIntakeQuery({
        ...systemIntake,
        id,
        decisionState: SystemIntakeDecisionState.NOT_GOVERNANCE,
        decisionNextSteps: null,
        decidedAt: null,
        trbFollowUpRecommendation: null
      })
    ]);

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    // page h1 still present
    screen.getByRole('heading', {
      level: 1,
      name: i18next.t<string>('taskList:navigation.nextSteps')
    });

    // LCID ISSUED banner on top
    screen.getByText(
      i18next.t<string>(
        'governanceReviewTeam:decision.requesterDecisionState_NOT_GOVERNANCE'
      )
    );

    // "Next steps" subsection should not render
    expect(
      screen.queryByRole('heading', {
        level: 2,
        name: i18next.t<string>('taskList:decision.nextSteps')
      })
    ).toBeNull();
  });

  it('Renders NOT_APPROVED', async () => {
    renderWith([
      getSystemIntakeQuery({
        ...systemIntake,
        id,
        decisionState: SystemIntakeDecisionState.NOT_APPROVED,
        decisionNextSteps: null,
        decidedAt: null,
        trbFollowUpRecommendation: null
      })
    ]);

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    // page h1 still present
    screen.getByRole('heading', {
      level: 1,
      name: i18next.t<string>('taskList:navigation.nextSteps')
    });

    // LCID ISSUED banner on top
    screen.getByText(
      i18next.t<string>(
        'governanceReviewTeam:decision.requesterDecisionState_NOT_APPROVED'
      )
    );

    // "Next steps" subsection should  render
    expect(
      screen.queryByRole('heading', {
        level: 2,
        name: i18next.t<string>('taskList:decision.nextSteps')
      })
    ).toBeInTheDocument();

    // Update System Profile section should NOT render — only for LCID_ISSUED
    expect(
      screen.queryByRole('heading', {
        level: 3,
        name: i18next.t<string>('taskList:decision.updateSystemProfile.heading')
      })
    ).not.toBeInTheDocument();
  });
});
