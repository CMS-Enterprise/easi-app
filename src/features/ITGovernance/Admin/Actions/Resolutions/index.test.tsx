import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  SystemIntakeDecisionState,
  SystemIntakeState
} from 'gql/generated/graphql';
import { systemIntake } from 'tests/mock/systemIntake';

import ResolutionTitleBox from './ResolutionTitleBox';
import Resolutions from '.';

describe('Resolutions page', () => {
  it('Renders for open request with no decision', () => {
    render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/resolutions`]}
      >
        <Route path={[`/it-governance/:systemId/resolutions`]}>
          <Resolutions systemIntake={systemIntake} />
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: 'Action: issue decision or close request'
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('radio', { name: 'Close request' })
    ).toBeInTheDocument();
  });

  it('Renders for closed request with decision issued', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntake.id}/resolutions`]}
      >
        <Route path={[`/it-governance/:systemId/resolutions`]}>
          <Resolutions
            systemIntake={{
              ...systemIntake,
              state: SystemIntakeState.CLOSED,
              decisionState: SystemIntakeDecisionState.NOT_APPROVED
            }}
          />
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: 'Action: change decision or re-open request'
      })
    ).toBeInTheDocument();

    // Select first option
    const options = screen.getAllByRole('radio');
    await user.click(options[0]);

    // Check that current decision option is listed first and checked
    const currentDecisionOption = screen.getByRole('radio', {
      name: 'Confirm current decision (Not approved by GRB)'
    });
    expect(currentDecisionOption).toBeChecked();
  });
});

describe('Resolution form', async () => {
  it('Renders title box', async () => {
    const action = 'Issue a life cycle ID';

    render(
      <MemoryRouter>
        <ResolutionTitleBox
          systemIntakeId={systemIntake.id}
          title={action}
          state={SystemIntakeState.OPEN}
          decisionState={SystemIntakeDecisionState.NO_DECISION}
        />
      </MemoryRouter>
    );

    const title = await screen.findByText(
      'Action: issue decision or close request'
    );
    expect(title).toBeInTheDocument();

    expect(screen.getByText('Selected resolution')).toBeInTheDocument();

    expect(screen.getByText(action)).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Change resolution' })
    ).toBeInTheDocument();
  });
});
