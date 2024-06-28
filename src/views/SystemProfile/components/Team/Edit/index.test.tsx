import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, within } from '@testing-library/react';
import i18next from 'i18next';

import { usernamesWithRoles } from 'data/mock/systemProfile';
import { MessageProvider } from 'hooks/useMessage';

import EditTeam from '.';

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
        name: i18next.t('systemProfile:singleSystem.editTeam.addNewTeamMember')
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
