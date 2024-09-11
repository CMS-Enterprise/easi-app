import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import teamRoles from 'data/mock/workspaceTeamRoles';

import TeamCard from '.';

describe('TeamCard', () => {
  it('renders', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <TeamCard roles={teamRoles} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
