import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';

import MakingARequest from './index';

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
  it('renders without errors', async () => {
    const mockStore = configureMockStore();
    const defaultStore = mockStore({
      auth: {
        euaId: 'AAAA'
      }
    });

    render(
      <MemoryRouter initialEntries={['/system/making-a-request']}>
        <MockedProvider>
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
    const tree = renderer
      .create(
        <MemoryRouter>
          <MockedProvider>
            <MakingARequest />
          </MockedProvider>
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
