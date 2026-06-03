import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import teamRoles from 'tests/mock/workspaceTeamRoles';

import TeamCard from '.';

describe('TeamCard', () => {
  it('links workspace team actions into the edit route family', () => {
    render(
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

    expect(
      screen.getByRole('link', { name: 'Add a team member' })
    ).toHaveAttribute(
      'href',
      '/systems/{11AB1A00-1234-5678-ABC1-1A001B00CC1B}/edit/team/team-member?workspace'
    );

    expect(
      screen.getByRole('link', { name: 'Manage system team' })
    ).toHaveAttribute(
      'href',
      '/systems/{11AB1A00-1234-5678-ABC1-1A001B00CC1B}/edit/team?workspace'
    );
  });
});
