import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import {
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  requester,
  systemIntake
} from 'data/mock/systemIntake';
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
          <Actions systemIntake={systemIntake} />
        </Route>
      </MemoryRouter>
    </VerboseMockedProvider>
  );
};

describe('IT Gov Actions', () => {
  it('Renders options and selects action', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/governance-review-team/${systemIntake.id}/actions`]}
      >
        <Route path={[`/governance-review-team/:systemId/actions/:action?`]}>
          <Actions systemIntake={systemIntake} />
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Request edits to a form' })
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
      mocks: [getSystemIntakeQuery, getSystemIntakeContactsQuery]
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
  });
});
