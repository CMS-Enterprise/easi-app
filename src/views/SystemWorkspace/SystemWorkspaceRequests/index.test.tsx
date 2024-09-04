import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

import {
  linkedSystemIntakes,
  linkedTrbRequests
} from 'data/mock/systemLinkedRequest';
import GetLinkedRequestsQuery from 'queries/GetLinkedRequestsQuery';
import {
  GetLinkedRequests,
  GetLinkedRequestsVariables
} from 'queries/types/GetLinkedRequests';
import { SystemIntakeState, TRBRequestState } from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';

import SystemWorkspaceRequests from '.';

describe('System Workspace Requests Table', () => {
  it('renders open requests', async () => {
    const cedarSystemId = '{11AB1A00-1234-5678-ABC1-1A001B00CC1B}';

    const getLinkedRequestsMockedQuery: MockedQuery<
      GetLinkedRequests,
      GetLinkedRequestsVariables
    > = {
      request: {
        query: GetLinkedRequestsQuery,
        variables: {
          cedarSystemId,
          systemIntakeState: SystemIntakeState.OPEN,
          trbRequestState: TRBRequestState.OPEN
        }
      },
      result: {
        data: {
          cedarSystemDetails: {
            __typename: 'CedarSystemDetails',
            cedarSystem: {
              __typename: 'CedarSystem',
              id: cedarSystemId,
              linkedSystemIntakes,
              linkedTrbRequests
            }
          }
        }
      }
    };

    const { asFragment } = render(
      <MockedProvider mocks={[getLinkedRequestsMockedQuery]}>
        <MemoryRouter
          initialEntries={[`/systems/${cedarSystemId}/workspace/requests`]}
        >
          <Route exact path="/systems/:systemId/workspace/requests">
            <SystemWorkspaceRequests />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    await screen.findByTestId('system-linked-requests');
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders closed requests', async () => {
    const cedarSystemId = '{11AB1A00-1234-5678-ABC1-1A001B00CC1B}';

    const getLinkedRequestsMockedQuery: MockedQuery<
      GetLinkedRequests,
      GetLinkedRequestsVariables
    > = {
      request: {
        query: GetLinkedRequestsQuery,
        variables: {
          cedarSystemId,
          systemIntakeState: SystemIntakeState.OPEN,
          trbRequestState: TRBRequestState.OPEN
        }
      },
      result: {
        data: {
          cedarSystemDetails: {
            __typename: 'CedarSystemDetails',
            cedarSystem: {
              __typename: 'CedarSystem',
              id: cedarSystemId,
              linkedSystemIntakes,
              linkedTrbRequests
            }
          }
        }
      }
    };

    const { asFragment } = render(
      <MockedProvider mocks={[getLinkedRequestsMockedQuery]}>
        <MemoryRouter
          initialEntries={[`/systems/${cedarSystemId}/workspace/requests`]}
        >
          <Route exact path="/systems/:systemId/workspace/requests">
            <SystemWorkspaceRequests />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    await screen.findByTestId('system-linked-requests');
    expect(asFragment()).toMatchSnapshot();
  });
});
