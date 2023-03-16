import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, within } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { requester, trbRequestSummary } from 'data/mock/trbRequest';
import GetTrbRequestSummaryQuery from 'queries/GetTrbRequestSummaryQuery';
import { GetTRBRequestAttendees } from 'queries/TrbAttendeeQueries';

import Summary from '.';

const trbRequestId = 'a4093ec7-caec-4e73-be3d-a8d6262bc61b';

const getTrbRequestQuery = {
  request: {
    query: GetTrbRequestSummaryQuery,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: { trbRequest: trbRequestSummary }
  }
};

const getTrbAttendeesQuery = {
  request: {
    query: GetTRBRequestAttendees,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: {
      trbRequest: {
        attendees: [
          {
            ...requester,
            trbRequestId
          }
        ]
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
              trbRequestId={trbRequestId}
              name={trbRequestSummary.name}
              requestType={trbRequestSummary.type}
              createdAt={trbRequestSummary.createdAt}
              state={trbRequestSummary.state}
              taskStatuses={trbRequestSummary.taskStatuses}
              trbLead={trbRequestSummary.trbLead}
              requester={requester}
              requesterString="Adeline Aarons, CMS"
              submissionDate="January 5, 2023"
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
