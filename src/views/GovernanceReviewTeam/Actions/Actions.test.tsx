import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { systemIntake } from 'data/mock/systemIntake';

import ChooseAction from './ChooseAction';
import RequestEdits from './RequestEdits';

describe('IT Gov Actions', () => {
  it('Renders options and selects action', async () => {
    const { getByRole, getByText, getByTitle } = render(
      <MemoryRouter
        initialEntries={[`/governance-review-team/${systemIntake.id}/actions`]}
      >
        <Route path={[`/governance-review-team/:systemId/actions`]}>
          <ChooseAction systemIntake={systemIntake} />
        </Route>
        <Route
          path={[`/governance-review-team/:systemId/actions/request-edits`]}
        >
          <RequestEdits />
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
    expect(requestEdits).toBeChecked();

    userEvent.click(getByRole('button', { name: 'Continue' }));

    expect(
      getByRole('heading', { name: 'Action: request edits' })
    ).toBeInTheDocument();
  });
});
