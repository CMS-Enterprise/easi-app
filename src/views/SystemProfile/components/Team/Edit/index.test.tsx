import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, within } from '@testing-library/react';
import i18next from 'i18next';

import { roles } from 'data/mock/systemProfile';
import GetSystemProfileTeamQuery from 'queries/SystemProfileTeamQueries';
import {
  GetSystemProfileTeam,
  GetSystemProfileTeamVariables
} from 'queries/types/GetSystemProfileTeam';
import { MockedQuery } from 'types/util';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import EditTeam from '.';

const cedarSystemId = '000-0000-1';

const getSystemProfileTeam: MockedQuery<
  GetSystemProfileTeam,
  GetSystemProfileTeamVariables
> = {
  request: {
    query: GetSystemProfileTeamQuery,
    variables: {
      cedarSystemId
    }
  },
  result: {
    data: {
      cedarSystemDetails: {
        __typename: 'CedarSystemDetails',
        cedarSystem: {
          __typename: 'CedarSystem',
          name: 'Easy Access to System Information'
        },
        businessOwnerInformation: {
          __typename: 'CedarBusinessOwnerInformation',
          numberOfContractorFte: '4',
          numberOfFederalFte: '6'
        },
        roles
      }
    }
  }
};

describe('Edit team page', () => {
  it('Renders the edit team page', async () => {
    const { findByRole, getByRole, getByTestId } = render(
      <MemoryRouter initialEntries={[`/systems/${cedarSystemId}/team/edit`]}>
        <Route path="/systems/:systemId/team/edit">
          <VerboseMockedProvider mocks={[getSystemProfileTeam]}>
            <EditTeam />
          </VerboseMockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(
      await findByRole('heading', {
        name: i18next.t('systemProfile:singleSystem.editTeam.title')
      })
    ).toBeInTheDocument();

    // Federal employees field
    const employeesFieldFederal = getByRole('spinbutton', {
      name: i18next.t('systemProfile:singleSystem.editTeam.federalEmployees')
    });
    expect(employeesFieldFederal).toHaveValue(6);

    // Contractors field
    const employeesFieldContractors = getByRole('spinbutton', {
      name: i18next.t('systemProfile:singleSystem.editTeam.contractors')
    });
    expect(employeesFieldContractors).toHaveValue(4);

    expect(
      getByRole('button', {
        name: i18next.t('systemProfile:singleSystem.editTeam.addNewTeamMember')
      })
    ).toBeInTheDocument();

    // Check number of team cards rendered
    const { getAllByTestId } = within(getByTestId('teamCardGroup'));
    expect(getAllByTestId('Card')).toHaveLength(12);
  });
});
