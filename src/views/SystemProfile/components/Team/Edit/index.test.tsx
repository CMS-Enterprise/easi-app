import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';

import { usernamesWithRoles } from 'data/mock/systemProfile';
import teamRoles, { teamRequisiteRoles } from 'data/mock/workspaceTeamRoles';
import { MessageProvider } from 'hooks/useMessage';
import { UsernameWithRoles } from 'types/systemProfile';
import getUsernamesWithRoles from 'utils/getUsernamesWithRoles';

import EditTeam, { requisiteLevelsOfTeamRoles } from '.';

const cedarSystemId = '000-0000-1';

describe('Edit team page', () => {
  it('Renders the edit team page', async () => {
    const { findByRole, getByRole, getByTestId } = render(
      <MemoryRouter initialEntries={[`/systems/${cedarSystemId}/team/edit`]}>
        <MessageProvider>
          <MockedProvider>
            <Route path="/systems/:systemId/team/edit">
              <EditTeam
                name="Easy Access to System Information"
                team={usernamesWithRoles}
                numberOfFederalFte={6}
                numberOfContractorFte={4}
              />
            </Route>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    expect(
      await findByRole('heading', {
        name: i18next.t('systemProfile:singleSystem.editTeam.title')
      })
    ).toBeInTheDocument();

    /* Employee fields hidden until work to update in CEDAR is completed */

    // const employeesFieldFederal = getByRole('spinbutton', {
    //   name: i18next.t('systemProfile:singleSystem.editTeam.federalEmployees')
    // });
    // expect(employeesFieldFederal).toHaveValue(6);

    // const employeesFieldContractors = getByRole('spinbutton', {
    //   name: i18next.t('systemProfile:singleSystem.editTeam.contractors')
    // });
    // expect(employeesFieldContractors).toHaveValue(4);

    expect(
      getByRole('button', {
        name: i18next.t('systemProfile:singleSystem.editTeam.addTeamMember')
      })
    ).toBeInTheDocument();

    // Check number of team cards rendered
    const { getAllByTestId } = within(getByTestId('teamCardGroup'));
    const teamCards = getAllByTestId('Card');
    expect(teamCards).toHaveLength(usernamesWithRoles.length);

    // Check for edit and remove buttons on team cards
    expect(
      within(teamCards[0]).getByRole('button', { name: 'Edit roles' })
    ).toBeInTheDocument();
    expect(
      within(teamCards[0]).getByRole('button', { name: 'Remove team member' })
    ).toBeInTheDocument();
  });
});

describe('Workspace team page', () => {
  function renderWorkspaceEditTeam(team: UsernameWithRoles[]) {
    return render(
      <MemoryRouter
        initialEntries={[`/systems/${cedarSystemId}/team/edit?workspace`]}
      >
        <MessageProvider>
          <MockedProvider>
            <Route path="/systems/:systemId/team/edit">
              <EditTeam
                name=""
                team={team}
                numberOfFederalFte={undefined}
                numberOfContractorFte={undefined}
              />
            </Route>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );
  }

  it('renders', async () => {
    const team = getUsernamesWithRoles(teamRoles);
    const { asFragment } = renderWorkspaceEditTeam(team);

    // Mock data for this test should have all requisite roles present
    expect(
      screen.queryByTestId('requisite-roles-alert')
    ).not.toBeInTheDocument();

    // Snapshot captures the assignment and ordering of team members and their multiple roles
    expect(asFragment()).toMatchSnapshot();
  });

  it.each(requisiteLevelsOfTeamRoles)(
    'shows the alert for missing role: %s',
    (...filterOutRoleNames: string[]) => {
      const team = getUsernamesWithRoles(
        teamRequisiteRoles.filter(
          r => !filterOutRoleNames.includes(r.roleTypeName!)
        )
      );
      renderWorkspaceEditTeam(team);
      screen.getByTestId('requisite-roles-alert');
    }
  );

  it.each([
    // BO
    {
      i: 0,
      t: 'This action cannot be undone. Each system should have at least one Business Owner, and Eliezer Grant is currently the only Business Owner listed for this system. Removing Eliezer Grant will remove any roles and permissions they have for this system.'
    },
    // System maintainer
    {
      i: 4,
      t: 'This action cannot be undone. Each system should have at least one System Maintainer, and Forest Brown is currently the only System Maintainer listed for this system. Removing Forest Brown will remove any roles and permissions they have for this system.'
    },
    // Any other
    {
      i: 5,
      t: 'This action cannot be undone. Removing Sasha Barrows will remove any roles and permissions they have for this system.'
    }
  ])(
    'shows modal feedback when one member of a required role type is left %#',
    async ({ i, t }) => {
      const team = getUsernamesWithRoles(teamRequisiteRoles);
      renderWorkspaceEditTeam(team);

      const rms = screen.getAllByRole('button', { name: 'Remove' });

      userEvent.click(rms[i]);

      await screen.findByRole('heading', {
        name: 'Are you sure you want to remove this team member?'
      });
      await screen.findByText(t);
    }
  );

  it('shows modal feedback when one member of the role set which includes project lead is left', async () => {
    const team = getUsernamesWithRoles(
      teamRequisiteRoles.filter(r => {
        return (
          r.roleTypeName !== 'Government Task Lead (GTL)' &&
          r.roleTypeName !== "Contracting Officer's Representative (COR)"
        );
      })
    );
    renderWorkspaceEditTeam(team);

    const rms = screen.getAllByRole('button', { name: 'Remove' });

    userEvent.click(rms[1]);

    await screen.findByRole('heading', {
      name: 'Are you sure you want to remove this team member?'
    });
    await screen.findByText(
      "This action cannot be undone. Each system should have at least one Project Lead, Government Task Lead (GTL), or Contracting Officer's Representative (COR), and Elbert Huel is currently the only one listed of this system. Removing Elbert Huel will remove any roles and permissions they have for this system."
    );
  });

  it('does not show the remove action for the last remaining team member', async () => {
    const team = getUsernamesWithRoles([teamRoles[0]]);
    renderWorkspaceEditTeam(team);
    expect(
      screen.queryByRole('button', { name: 'Remove' })
    ).not.toBeInTheDocument();
  });
});
