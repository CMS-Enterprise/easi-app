import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';
import teamRoles from 'tests/mock/workspaceTeamRoles';

import { MessageProvider } from 'hooks/useMessage';

import Team from '.';

vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: () => ({
    editableSystemProfile: true
  })
}));

describe('Team', () => {
  it('renders the workspace team management experience', () => {
    render(
      <MemoryRouter initialEntries={['/systems/000-100-0/edit/team?workspace']}>
        <Route path="/systems/:systemId/edit/team/:action?">
          <MockedProvider>
            <MessageProvider>
              <Team systemName="Test System" roles={teamRoles} />
            </MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: i18next.t('systemProfile:singleSystem.editTeam.workspace.title')
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        i18next.t<string>(
          'systemProfile:singleSystem.editTeam.workspace.helpText'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: i18next.t('systemProfile:singleSystem.editTeam.addTeamMember')
      })
    ).toBeInTheDocument();
  });
});
