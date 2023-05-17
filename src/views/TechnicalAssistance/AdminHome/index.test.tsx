import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { attendees, requester, trbRequestSummary } from 'data/mock/trbRequest';
import { MessageProvider } from 'hooks/useMessage';
import GetTrbLeadOptionsQuery from 'queries/GetTrbLeadOptionsQuery';
import GetTrbRequestHomeQuery from 'queries/GetTrbRequestHomeQuery';
import GetTrbRequestSummaryQuery from 'queries/GetTrbRequestSummaryQuery';
import { GetTRBRequestAttendeesQuery } from 'queries/TrbAttendeeQueries';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import TRBRequestInfoWrapper from './RequestContext';
import AdminHome from '.';

const trbRequestId = trbRequestSummary.id;

const getTrbRequestAttendeesQuery = {
  request: {
    query: GetTRBRequestAttendeesQuery,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: {
      trbRequest: {
        __typename: 'TRBRequest',
        id: trbRequestId,
        attendees: [requester, ...attendees]
      }
    }
  }
};

const getTrbRequestHomeQuery = {
  request: {
    query: GetTrbRequestHomeQuery,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: {
      trbRequest: {
        __typename: 'TRBRequest',
        id: trbRequestId,
        consultMeetingTime: null,
        taskStatuses: trbRequestSummary.taskStatuses,
        form: {
          id: 'c92ec6a6-cd5b-4be3-895a-e88f7de76c22',
          modifiedAt: null,
          __typename: 'TRBRequestForm'
        },
        adviceLetter: null,
        trbLeadInfo: {
          commonName: '',
          email: '',
          __typename: 'UserInfo'
        },
        documents: [],
        adminNotes: trbRequestSummary.adminNotes
      }
    }
  }
};

const getTrbLeadOptionsQuery = {
  request: {
    query: GetTrbLeadOptionsQuery
  },
  result: {
    data: {
      trbLeadOptions: [
        {
          euaUserId: 'ABCD',
          commonName: 'Adeline Aarons',
          __typename: 'UserInfo'
        },
        {
          euaUserId: 'TEST',
          commonName: 'Terry Thompson',
          __typename: 'UserInfo'
        },
        {
          euaUserId: 'A11Y',
          commonName: 'Ally Anderson',
          __typename: 'UserInfo'
        },
        {
          euaUserId: 'GRTB',
          commonName: 'Gary Gordon',
          __typename: 'UserInfo'
        }
      ]
    }
  }
};

const getTrbRequestSummaryQuery = {
  request: {
    query: GetTrbRequestSummaryQuery,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: {
      trbRequest: trbRequestSummary
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

describe('TRB admin home', () => {
  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/trb/${trbRequestId}/request`]}>
        <MessageProvider>
          <Provider store={defaultStore}>
            <VerboseMockedProvider
              mocks={[
                getTrbRequestSummaryQuery,
                getTrbRequestSummaryQuery,
                getTrbRequestHomeQuery,
                getTrbRequestAttendeesQuery,
                getTrbRequestAttendeesQuery,
                getTrbLeadOptionsQuery
              ]}
            >
              <TRBRequestInfoWrapper>
                <Route path="/trb/:id/:activePage?">
                  <AdminHome />
                </Route>
              </TRBRequestInfoWrapper>
            </VerboseMockedProvider>
          </Provider>
        </MessageProvider>
      </MemoryRouter>
    );

    // Wait for page to load
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
