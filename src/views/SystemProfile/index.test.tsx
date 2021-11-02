import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { MessageProvider } from 'hooks/useMessage';

import SystemProfileHome from './index';

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

describe('The making a request page', () => {
  it('renders without errors', () => {
    const mockStore = configureMockStore();
    const defaultStore = mockStore({
      auth: {
        euaId: 'AAAA'
      }
    });

    render(
      <MemoryRouter initialEntries={['/system/making-a-request']}>
        <Provider store={defaultStore}>
          <MessageProvider>
            <Route path="/system/making-a-request">
              <SystemProfileHome />
            </Route>
          </MessageProvider>
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('making-a-system-request')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <SystemProfileHome />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
