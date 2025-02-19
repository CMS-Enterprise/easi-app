import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import GetTrbRequestsQuery from 'gql/legacyGQL/GetTrbRequestsQuery';
import {
  // eslint-disable-next-line camelcase
  GetTrbRequests_myTrbRequests
} from 'gql/legacyGQL/types/GetTrbRequests';
import configureMockStore from 'redux-mock-store';

import { TRBRequestState, TRBRequestStatus } from 'types/graphql-global-types';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ProcessFlow from './ProcessFlow';
import RequestType from './RequestType';
import TechnicalAssistance from '.';

const mockStore = configureMockStore();

describe('Technical Assistance (TRB) homepage', () => {
  // eslint-disable-next-line camelcase
  const myTrbRequests: GetTrbRequests_myTrbRequests[] = [
    {
      id: '1afc9242-f244-47a3-9f91-4d6fedd8eb91',
      name: 'My excellent question',
      state: TRBRequestState.OPEN,
      status: TRBRequestStatus.NEW,
      createdAt: '2022-09-12T17:46:08.067675Z',
      form: {
        submittedAt: '2023-01-23T20:06:52.123703Z',
        __typename: 'TRBRequestForm'
      },
      __typename: 'TRBRequest'
    },
    {
      id: '9841c768-bdcd-4856-bae2-62cfdaffacf6',
      name: 'TACO Review',
      state: TRBRequestState.OPEN,
      status: TRBRequestStatus.NEW,
      createdAt: '2022-09-12T17:46:08.07031Z',
      form: {
        submittedAt: '',
        __typename: 'TRBRequestForm'
      },
      __typename: 'TRBRequest'
    }
  ];

  /** Renders trb homepage component */
  const renderHomepage = (userGroups?: string[]) => {
    /** Current user auth for Provider  component */
    const auth = {
      euaId: 'SF13',
      name: 'Jerry Seinfeld',
      isUserSet: true,
      groups: userGroups || []
    };

    // Return rendered homepage
    return render(
      <MemoryRouter initialEntries={['/trb']}>
        <Provider store={mockStore({ auth })}>
          <Route path="/trb">
            <VerboseMockedProvider
              mocks={[
                {
                  request: {
                    query: GetTrbRequestsQuery
                  },
                  result: {
                    data: {
                      myTrbRequests
                    }
                  }
                }
              ]}
            >
              <TechnicalAssistance />
            </VerboseMockedProvider>
          </Route>
        </Provider>
      </MemoryRouter>
    );
  };

  it('renders the homepage with a list of trb requests', async () => {
    const { asFragment, findByTestId } = renderHomepage();

    /** TRB request */
    const request = await findByTestId(`trbRequest-${myTrbRequests[0].id}`);
    // Check that request is in document
    expect(request).toBeInTheDocument();

    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders site alert when user is trb admin', async () => {
    const { findByTestId } = renderHomepage(['EASI_TRB_ADMIN_D']);

    /** TRB admin site alert */
    const siteAlert = await findByTestId('trbAdmin-siteAlert');

    // Check that alert is in document
    expect(siteAlert).toBeInTheDocument();
  });
});

describe('TRB Subview snapshots', () => {
  it('matches Request Type', () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={['/trb/type/b1120f6a-87d7-4bcd-b8f2-0835c51b2d52']}
      >
        <MockedProvider>
          <Route path="/trb/type/:id">
            <RequestType />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches Process Flow', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[{ state: { requestType: 'NEED_HELP' } }]}>
        <MockedProvider>
          <ProcessFlow />
        </MockedProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
