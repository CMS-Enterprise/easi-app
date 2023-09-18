import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  SystemIntakeDecisionState,
  SystemIntakeState
} from 'types/graphql-global-types';

import ResolutionTitleBox from './ResolutionTitleBox';
import Resolutions from '.';

const systemIntakeId = 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2';

describe('Resolutions page', () => {
  it('Renders for open request with no decision', () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/governance-review-team/${systemIntakeId}/resolutions`
        ]}
      >
        <Route path={[`/governance-review-team/:systemId/resolutions`]}>
          <Resolutions
            systemIntakeId={systemIntakeId}
            state={SystemIntakeState.OPEN}
            decisionState={SystemIntakeDecisionState.NO_DECISION}
          />
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

  it('Renders for closed request with decision issued', () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/governance-review-team/${systemIntakeId}/resolutions`
        ]}
      >
        <Route path={[`/governance-review-team/:systemId/resolutions`]}>
          <Resolutions
            systemIntakeId={systemIntakeId}
            state={SystemIntakeState.CLOSED}
            decisionState={SystemIntakeDecisionState.NOT_APPROVED}
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
    userEvent.click(options[0]);

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
          systemIntakeId={systemIntakeId}
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
