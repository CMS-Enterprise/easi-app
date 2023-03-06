import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import GetTrbRequestsQuery from 'queries/GetTrbRequestsQuery';

import ProcessFlow from './ProcessFlow';
import RequestType from './RequestType';
import TechnicalAssistance from '.';

const mockStore = configureMockStore();

describe('Technical Assistance (TRB) homepage', () => {
  /** GetTrbRequestsQuery return values */
  const trbRequests = [
    {
      id: '1afc9242-f244-47a3-9f91-4d6fedd8eb91',
      name: 'My excellent question',
      status: 'OPEN',
      createdAt: '2022-09-12T17:46:08.067675Z',
      form: {
        submittedAt: '2023-01-23T20:06:52.123703Z'
      }
    },
    {
      id: '9841c768-bdcd-4856-bae2-62cfdaffacf6',
      name: 'TACO Review',
      status: 'OPEN',
      createdAt: '2022-09-12T17:46:08.07031Z',
      form: {
        submittedAt: ''
      }
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
            <MockedProvider
              mocks={[
                {
                  request: {
                    query: GetTrbRequestsQuery
                  },
                  result: {
                    data: {
                      trbRequests
                    }
                  }
                }
              ]}
            >
              <TechnicalAssistance />
            </MockedProvider>
          </Route>
        </Provider>
      </MemoryRouter>
    );
  };

  it('renders the homepage with a list of trb requests', async () => {
    const { asFragment, findByTestId } = renderHomepage();

    /** TRB request */
    const request = await findByTestId(`trbRequest-${trbRequests[0].id}`);
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
      <MemoryRouter>
        <MockedProvider>
          <RequestType />
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
