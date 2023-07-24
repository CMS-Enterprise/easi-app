import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
    const { getByRole, getByText, getByTitle } = render(
      <MemoryRouter
        initialEntries={[`/governance-review-team/${systemIntake.id}/actions`]}
      >
        <Route path={[`/governance-review-team/:systemId/actions/:action?`]}>
          <Actions systemIntake={systemIntake} />
        </Route>
      </MemoryRouter>
    );

    expect(
      getByRole('heading', { name: 'Progress to a new step' })
    ).toBeInTheDocument();

    // Check that correct decision action renders for OPEN status with no decision
    expect(
      getByRole('heading', { name: 'Issue a decision or close this request' })
    ).toBeInTheDocument();
    expect(
      getByText(
        'Issue a Life Cycle ID, mark this project as not approved, or close this request for another reason.'
      )
    ).toBeInTheDocument();

    // Check that selecting action and submitting form takes user to correct route
    const requestEdits = getByTitle('Request edits to a form');
    userEvent.click(requestEdits);
  });

  it('Renders request edits action', async () => {
    const { getByRole, findByRole } = renderActionPage({
      action: 'request-edits',
      mocks: [getSystemIntakeQuery, getSystemIntakeContactsQuery]
    });

    expect(
      await findByRole('heading', { name: 'Action: request edits' })
    ).toBeInTheDocument();

    // Requester is default recipient
    expect(
      getByRole('checkbox', {
        name: `${requester.commonName}, ${requester.component} (Requester)`
      })
    ).toBeChecked();
  });
});
