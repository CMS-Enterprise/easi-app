import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';

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

describe('The making a request page', () => {
  it('renders without errors', () => {
    render(
      <MemoryRouter initialEntries={['/system/making-a-request']}>
        <MessageProvider>
          <Route path="/system/making-a-request">
            <MakingARequest />
          </Route>
        </MessageProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('making-a-system-request')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <MakingARequest />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
