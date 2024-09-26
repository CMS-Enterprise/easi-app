import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

import teamRoles from 'data/mock/workspaceTeamRoles';

import TeamCard from '.';

describe('TeamCard', () => {
  it('renders', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/systems/%7B11AB1A00-1234-5678-ABC1-1A001B00CC1B%7D/workspace`
        ]}
      >
        <Route path="/systems/:systemId/workspace">
          <TeamCard roles={teamRoles} />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
