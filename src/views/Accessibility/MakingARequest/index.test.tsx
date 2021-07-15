import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';

import MakingARequest from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => {},
        logout: async () => {}
      }
    };
  }
}));

describe('The 508 making a request page', () => {
  it('renders without errors', () => {
    const mockStore = configureMockStore();
    const defaultStore = mockStore({
      auth: {
        euaId: 'AAAA'
      }
    });

    render(
      <MemoryRouter initialEntries={['/508/making-a-request']}>
        <Provider store={defaultStore}>
          <MessageProvider>
            <Route path="/508/making-a-request">
              <MakingARequest />
            </Route>
          </MessageProvider>
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('making-a-508-request')).toBeInTheDocument();
  });
});
