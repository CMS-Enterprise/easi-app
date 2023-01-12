import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, within } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { requester, trbRequest } from 'data/mock/trbRequest';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';
import { GetTRBRequestAttendees } from 'queries/TrbAttendeeQueries';

import Summary from '.';

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

const getTrbAttendeesQuery = {
  request: {
    query: GetTRBRequestAttendees,
    variables: {
      id: trbRequest.id
    }
  },
  result: {
    data: {
      trbRequest: {
        attendees: [requester]
      }
    }
  }
};

const mockStore = configureMockStore();
const defaultStore = mockStore({
  auth: {
    euaId: 'SF13',
    name: 'Jerry Seinfeld',
    isUserSet: true,
    groups: ['EASI_TRB_ADMIN_D']
  }
});

describe('TRB Admin Home summary', () => {
  it('renders TRB request details', async () => {
    const { asFragment, findByTestId, getByTestId } = render(
      <MemoryRouter>
        <MockedProvider mocks={[getTrbRequestQuery, getTrbAttendeesQuery]}>
          <Provider store={defaultStore}>
            <Summary
              trbRequestId={trbRequest.id}
              name={trbRequest.name}
              requestType={trbRequest.type}
              createdAt={trbRequest.createdAt}
              createdBy={trbRequest.createdBy}
              status={trbRequest.status}
              taskStatuses={trbRequest.taskStatuses}
              trbLead={trbRequest.trbLead}
            />
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    /** Formatted requester string */
    const requesterString = await findByTestId(
      `trbSummary-requester_${requester?.userInfo?.euaUserId}`
    );

    // Check that requester shows correct name and component acronym
    expect(requesterString).toHaveTextContent('Adeline Aarons, CMS');

    // Check that submission date is formatted correctly
    expect(getByTestId('trbSummary-submissionDate')).toHaveTextContent(
      'January 5, 2023'
    );

    // Check that correct task status is rendered
    expect(getByTestId('trbSummary-status')).toHaveTextContent(
      'Ready to start request form'
    );

    /** TRB Lead container */
    const trbLeadContainer = getByTestId('trbSummary-trbLead');

    // Check that TRB lead shows as not assigned
    expect(within(trbLeadContainer).getByText('Not assigned'));

    // Check that assign button is rendered
    expect(within(trbLeadContainer).getByRole('button', { name: 'Assign' }));

    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
