import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetCedarContactsDocument,
  GetTRBRequestAttendeesDocument,
  GetTRBRequestAttendeesQuery,
  GetTRBRequestDocument,
  GetTRBRequestQuery
} from 'gql/generated/graphql';
import { attendees, requester, trbRequest } from 'tests/mock/trbRequest';

import contactRoles from 'constants/enums/contactRoles';

import Attendees from './Attendees';

/** Requester object with initial null values for component and role */
const initialRequester: GetTRBRequestAttendeesQuery['trbRequest']['attendees'][0] =
  {
    ...requester,
    component: null,
    role: null
  };

describe('Trb Request form: Attendees', () => {
  const mockRefetch = async (): Promise<
    ApolloQueryResult<GetTRBRequestQuery>
  > => {
    return {
      loading: false,
      networkStatus: NetworkStatus.ready,
      data: {
        __typename: 'Query',
        trbRequest
      }
    };
  };

  const getAttendeesQuery = {
    request: {
      query: GetTRBRequestAttendeesDocument,
      variables: {
        id: trbRequest.id
      }
    },
    result: {
      data: {
        trbRequest: {
          id: trbRequest.id,
          attendees: [initialRequester, ...attendees]
        }
      }
    }
  };

  const getTrbRequestQuery = {
    request: {
      query: GetTRBRequestDocument,
      variables: {
        id: trbRequest.id
      }
    },
    result: {
      data: trbRequest
    }
  };

  const getCedarContactsQuery = {
    request: {
      query: GetCedarContactsDocument,
      variables: {
        commonName: initialRequester.userInfo?.commonName
      }
    },
    result: {
      data: requester
    }
  };

  it('Renders the attendees form', async () => {
    const { getByTestId, findByTestId } = render(
      <MemoryRouter>
        <MockedProvider
          mocks={[getAttendeesQuery, getTrbRequestQuery, getCedarContactsQuery]}
          addTypename={false}
        >
          <Attendees
            request={trbRequest}
            stepUrl={{
              current: `/trb/requests/${trbRequest.id}/attendees`,
              next: `/trb/requests/${trbRequest.id}/documents`,
              back: `/trb/requests/${trbRequest.id}/subject`
            }}
            refetchRequest={mockRefetch}
            setIsStepSubmitting={() => {}}
            setStepSubmit={() => {}}
            setFormAlert={() => {}}
            taskListUrl=""
          />
        </MockedProvider>
      </MemoryRouter>
    );

    const requesterContactSelect = await findByTestId('cedar-contact-select');

    // Check that requester name and EUA matches mocked query results
    expect(requesterContactSelect).toHaveValue(
      `${requester.userInfo?.commonName}, ${requester.userInfo?.euaUserId} (${requester.userInfo?.email})`
    );

    const requesterComponentField = getByTestId(
      'trb-requester-component'
    ) as HTMLSelectElement;
    const requesterRoleField = getByTestId(
      'trb-requester-role'
    ) as HTMLSelectElement;

    // Wait until the component option is rendered after reset()
    const componentOption = await screen.findByRole('option', {
      name: requester.component! // visible label
    });

    // Select and await
    await userEvent.selectOptions(requesterComponentField, componentOption);

    // Assert by display value (matches visible text in the dropdown)
    expect(requesterComponentField).toHaveDisplayValue(requester.component!);

    // Wait until the role option is rendered after reset()
    const roleOption = await screen.findByRole('option', {
      name: contactRoles[requester.role!]
    });

    await userEvent.selectOptions(requesterRoleField, roleOption);

    // Assert by display label
    expect(requesterRoleField).toHaveDisplayValue(
      contactRoles[requester.role!]
    );

    // Also assert the underlying value attribute matches the role enum
    await waitFor(() =>
      expect(requesterRoleField).toHaveValue(
        (roleOption as HTMLOptionElement).value
      )
    );
  });
});
