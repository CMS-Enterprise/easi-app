import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { GetRequestsDocument } from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';

import MakingARequest from './index';

const getRequestsMock = {
  request: {
    query: GetRequestsDocument
  },
  result: {
    data: {
      mySystemIntakes: [],
      myTrbRequests: []
    }
  }
};

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => {
          return {
            name: 'John Doe'
          };
        },
        logout: async () => {}
      }
    };
  }
}));

describe('The making a request page', () => {
  const mockStore = configureMockStore();
  const defaultStore = mockStore({
    auth: {
      euaId: 'AAAA'
    }
  });

  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={['/system/making-a-request']}>
        <MockedProvider mocks={[getRequestsMock]}>
          <Provider store={defaultStore}>
            <MessageProvider>
              <Route path="/system/making-a-request">
                <MakingARequest />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('making-a-system-request')).toBeInTheDocument();
    });
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MockedProvider mocks={[getRequestsMock]}>
          <Provider store={defaultStore}>
            <MessageProvider>
              <MakingARequest />
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
