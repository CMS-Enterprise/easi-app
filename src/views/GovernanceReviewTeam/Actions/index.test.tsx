import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  getGovernanceTaskListQuery,
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  requester,
  systemIntake
} from 'data/mock/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import { MockedQuery } from 'types/util';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Actions from '.';

const renderActionPage = ({
  mocks,
  action
}: {
  mocks: MockedQuery[];
  action?: string;
}) => {
  return render(
    <VerboseMockedProvider mocks={mocks}>
      <MemoryRouter
        initialEntries={[
          `/governance-review-team/${systemIntake.id}/actions/${action}`
        ]}
      >
        <Route path={[`/governance-review-team/:systemId/actions/:subPage?`]}>
          <MessageProvider>
            <Actions systemIntake={systemIntake} />
          </MessageProvider>
        </Route>
      </MemoryRouter>
    </VerboseMockedProvider>
  );
};

describe('IT Gov Actions', () => {
  it('Renders options and selects action', async () => {
    render(
      <VerboseMockedProvider mocks={[getGovernanceTaskListQuery]}>
        <MemoryRouter
          initialEntries={[
            `/governance-review-team/${systemIntake.id}/actions`
          ]}
        >
          <Route path={[`/governance-review-team/:systemId/actions/:action?`]}>
            <MessageProvider>
              <Actions systemIntake={systemIntake} />
            </MessageProvider>
          </Route>
        </MemoryRouter>
      </VerboseMockedProvider>
    );

    expect(
      await screen.findByRole('heading', { name: 'Request edits to a form' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Progress to a new step' })
    ).toBeInTheDocument();

    // Check that correct decision action renders for OPEN status with no decision
    expect(
      screen.getByRole('heading', {
        name: 'Issue a decision or close this request'
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Issue a Life Cycle ID, mark this project as not approved, or close this request for another reason.'
      )
    ).toBeInTheDocument();
  });

  it('Renders request edits action', async () => {
    renderActionPage({
      action: 'request-edits',
      mocks: [
        getSystemIntakeQuery,
        getSystemIntakeContactsQuery,
        getGovernanceTaskListQuery
      ]
    });

    expect(
      await screen.findByRole('heading', { name: 'Action: request edits' })
    ).toBeInTheDocument();

    // Requester is default recipient
    expect(
      screen.getByRole('checkbox', {
        name: `${requester.commonName}, ${requester.component} (Requester)`
      })
    ).toBeChecked();

    // Modal should trigger on submit
    userEvent.click(screen.getByRole('button', { name: 'Complete action' }));
    expect(
      await screen.findByText(
        'Are you sure you want to complete this action to request edits?'
      )
    ).toBeInTheDocument();
  });
});
