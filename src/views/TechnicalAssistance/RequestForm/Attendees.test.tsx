import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { attendees, requester, trbRequest } from 'data/mock/trbRequest';
import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';
import { GetTRBRequestAttendeesQuery } from 'queries/TrbAttendeeQueries';
import { GetTrbRequest } from 'queries/types/GetTrbRequest';
import { TRBAttendee } from 'queries/types/TRBAttendee';

import Attendees from './Attendees';

/** Requester object with initial null values for component and role */
const initialRequester: TRBAttendee = {
  ...requester,
  component: null,
  role: null
};

describe('Trb Request form: Attendees', () => {
  const mockRefetch = async (): Promise<ApolloQueryResult<GetTrbRequest>> => {
    return {
      loading: false,
      networkStatus: NetworkStatus.ready,
      data: {
        trbRequest
      }
    };
  };

  const getAttendeesQuery = {
    request: {
      query: GetTRBRequestAttendeesQuery,
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
      query: GetTrbRequestQuery,
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
      query: GetCedarContactsQuery,
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
      `${requester.userInfo?.commonName}, ${requester.userInfo?.euaUserId}`
    );

    const requesterComponentField = getByTestId('trb-requester-component');
    const requesterRoleField = getByTestId('trb-requester-role');

    // Check that form loads initial null values for requester component and role
    expect(requesterComponentField).not.toHaveValue();
    expect(requesterRoleField).not.toHaveValue();

    // Select requester component
    userEvent.selectOptions(requesterComponentField, [requester.component!]);
    expect(requesterComponentField).toHaveValue(requester.component);

    // Select requester role
    userEvent.selectOptions(requesterRoleField, [requester.role!]);
    expect(requesterRoleField).toHaveValue(requester.role);
  });
});
