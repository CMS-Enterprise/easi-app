import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import { render, screen, waitFor } from '@testing-library/react';
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
        <Provider store={defaultStore}>
          <MessageProvider>
            <Route path="/system/making-a-request">
              <MakingARequest />
            </Route>
          </MessageProvider>
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('making-a-system-request')).toBeInTheDocument();
    });
  });

  it('matches the snapshot', async () => {
    let tree: any;
    await act(async () => {
      tree = renderer.create(
        <MemoryRouter>
          <MakingARequest />
        </MemoryRouter>
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
