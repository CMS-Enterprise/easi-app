import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

import { attendees, requester, trbRequest } from 'data/mock/trbRequest';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';
import { GetTRBRequestAttendees } from 'queries/TrbAttendeeQueries';
import { GetTrbRequest } from 'queries/types/GetTrbRequest';

import Attendees from './Attendees';

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
      query: GetTRBRequestAttendees,
      variables: {
        id: trbRequest.id
      }
    },
    result: {
      data: {
        trbRequest: { requester, attendees }
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

  it('Renders the attendees form', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        euaId: requester?.userInfo?.euaUserId,
        name: requester?.userInfo?.commonName
      }
    });
    const { asFragment, getByTestId } = render(
      <MemoryRouter>
        <MockedProvider
          mocks={[getAttendeesQuery, getTrbRequestQuery]}
          addTypename={false}
        >
          <Provider store={store}>
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
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    // Check for requester name
    expect(getByTestId('cedar-contact-select')).toHaveValue(
      `${requester.userInfo?.commonName}, ${requester.userInfo?.euaUserId}`
    );

    // Select requester component
    userEvent.selectOptions(getByTestId('trb-requester-component'), [
      requester.component
    ]);
    expect(getByTestId('trb-requester-component')).toHaveValue(
      requester.component
    );

    // Select requester role
    userEvent.selectOptions(getByTestId('trb-requester-role'), [
      requester.role
    ]);
    expect(getByTestId('trb-requester-role')).toHaveValue(requester.role);

    // Wait for contacts to load
    await waitFor(() => {
      // Check for first additional contact
      getByTestId(`trbAttendee-${attendees[0]?.userInfo?.euaUserId}`);
    });

    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
