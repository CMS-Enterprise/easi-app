import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { InMemoryCache } from '@apollo/client';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetTRBLeadOptionsDocument,
  GetTRBRequestAttendeesDocument,
  GetTRBRequestHomeDocument,
  GetTRBRequestSummaryDocument
} from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';
import { attendees, requester, trbRequestSummary } from 'tests/mock/trbRequest';

import { MessageProvider } from 'hooks/useMessage';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import TRBRequestInfoWrapper from './_components/RequestContext';
import AdminHome from '.';

// Reusable constants to keep mocks consistent and avoid cache warnings
const UNASSIGNED_LEAD = {
  __typename: 'UserInfo' as const,
  euaUserId: 'UNASSIGNED',
  commonName: '',
  email: ''
};

const COMPLETE_TASK_STATUSES = {
  __typename: 'TRBTaskStatuses' as const,
  formStatus: 'IN_PROGRESS',
  feedbackStatus: 'CANNOT_START_YET',
  consultPrepStatus: 'CANNOT_START_YET',
  attendConsultStatus: 'CANNOT_START_YET',
  guidanceLetterStatus: 'CANNOT_START_YET'
};

// Apollo cache with typePolicies to prevent merge warnings
const cache = new InMemoryCache({
  typePolicies: {
    UserInfo: { keyFields: ['euaUserId'] },
    // Treat embedded statuses as value objects and merge partials
    TRBTaskStatuses: { keyFields: false },
    TRBRequest: {
      fields: {
        trbLeadInfo: {
          merge(_existing, incoming) {
            return incoming;
          }
        },
        taskStatuses: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          }
        }
      }
    }
  }
});

const trbRequestId = trbRequestSummary.id;

const getTrbRequestAttendeesQuery = {
  request: {
    query: GetTRBRequestAttendeesDocument,
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
    query: GetTRBRequestHomeDocument,
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
        taskStatuses: COMPLETE_TASK_STATUSES,
        form: {
          id: 'c92ec6a6-cd5b-4be3-895a-e88f7de76c22',
          modifiedAt: null,
          __typename: 'TRBRequestForm'
        },
        guidanceLetter: null,
        trbLeadInfo: UNASSIGNED_LEAD,
        documents: [],
        adminNotes: trbRequestSummary.adminNotes
      }
    }
  }
};

const getTrbLeadOptionsQuery = {
  request: {
    query: GetTRBLeadOptionsDocument
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
    query: GetTRBRequestSummaryDocument,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: {
      trbRequest: {
        ...trbRequestSummary,
        trbLeadInfo: UNASSIGNED_LEAD,
        taskStatuses: COMPLETE_TASK_STATUSES
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

describe('TRB admin home', () => {
  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/trb/${trbRequestId}/request`]}>
        <MessageProvider>
          <Provider store={defaultStore}>
            <VerboseMockedProvider
              cache={cache}
              mocks={[
                // Some components may re-request; keep duplicate mocks
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
