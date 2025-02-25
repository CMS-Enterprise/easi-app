import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { FetchResult } from '@apollo/client';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import {
  CedarAssigneeType,
  GetCedarRoleTypesDocument,
  GetCedarRoleTypesQuery,
  SetRolesForUserOnSystemMutation
} from 'gql/generated/graphql';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';
import { UsernameWithRoles } from 'types/systemProfile';
import { MockedQuery } from 'types/util';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import TeamMemberForm from './TeamMemberForm';

const cedarSystemId = '000-0000-1';

const getCedarRoleTypesQuery: MockedQuery<GetCedarRoleTypesQuery> = {
  request: {
    query: GetCedarRoleTypesDocument,
    variables: {}
  },
  result: {
    data: {
      __typename: 'Query',
      roleTypes: []
    }
  }
};

const user: UsernameWithRoles = {
  assigneeUsername: 'SF13',
  roles: [
    {
      application: 'alfabet',
      objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
      roleTypeID: '{ED77C4FD-3078-4f65-8FD4-7350DBAE7283}',
      assigneeType: CedarAssigneeType.PERSON,
      assigneeUsername: 'B4UU',
      assigneeEmail: 'cathy.laruffa@cms.hhs.gov',
      assigneeOrgID: null,
      assigneeOrgName: null,
      assigneeFirstName: 'CATHY',
      assigneeLastName: 'LaRuffa',
      roleTypeName: 'System Issues Contact',
      roleID: '{DC86C4CA-8688-b586-8357-8D69F2B3EE2D}',
      __typename: 'CedarRole'
    },
    {
      application: 'alfabet',
      objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
      roleTypeID: '{C266D5BF-C298-4ec9-AE49-24DBB8577947}',
      assigneeType: CedarAssigneeType.PERSON,
      assigneeUsername: 'B4UU',
      assigneeEmail: 'cathy.laruffa@cms.hhs.gov',
      assigneeOrgID: null,
      assigneeOrgName: null,
      assigneeFirstName: 'CATHY',
      assigneeLastName: 'LaRuffa',
      roleTypeName: 'Data Center Contact',
      roleID: '{DC86C4CA-8688-b586-94F6-A3CB6D5FCF3F}',
      __typename: 'CedarRole'
    }
  ]
};

const mockUpdateRoles = async (): Promise<
  FetchResult<SetRolesForUserOnSystemMutation>
> => {
  return {
    data: {
      __typename: 'Mutation',
      setRolesForUserOnSystem: null
    }
  };
};

describe('Edit team page', () => {
  it('Renders add team member form', async () => {
    const { getByRole, getByTestId } = render(
      <MemoryRouter initialEntries={[`/systems/${cedarSystemId}/team/edit`]}>
        <VerboseMockedProvider mocks={[getCedarRoleTypesQuery]}>
          <MessageProvider>
            <Route path="/systems/:systemId/team/edit">
              <TeamMemberForm
                cedarSystemId="b7d0695d-4c24-4942-a815-77655f43783c"
                updateRoles={mockUpdateRoles}
                loading={false}
                team={[]}
              />
            </Route>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(
      getByRole('heading', {
        level: 1,
        name: i18next.t('Add a team member')
      })
    ).toBeInTheDocument();
  });

  it('Renders edit team member form', async () => {
    const { getByRole, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/systems/${cedarSystemId}/team/edit`,
            // Define user state load edit form
            state: { user }
          }
        ]}
      >
        <VerboseMockedProvider mocks={[getCedarRoleTypesQuery]}>
          <MessageProvider>
            <Route path="/systems/:systemId/team/edit">
              <TeamMemberForm
                cedarSystemId="b7d0695d-4c24-4942-a815-77655f43783c"
                updateRoles={mockUpdateRoles}
                loading={false}
                team={[]}
              />
            </Route>
          </MessageProvider>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(
      getByRole('heading', {
        level: 1,
        name: i18next.t('Edit team member roles')
      })
    ).toBeInTheDocument();
  });
});
