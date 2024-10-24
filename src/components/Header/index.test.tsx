import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { mount, shallow } from 'enzyme';

import easiMockStore from 'utils/testing/easiMockStore';

import { Header } from './index';

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => ({
          name: 'John Doe'
        }),
        logout: async () => {}
      }
    };
  }
}));

describe('The Header component', () => {
  const store = easiMockStore();

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  });

  describe('When logged in', () => {
    it('displays a login button', () => {
      const component = shallow(<Header />);
      expect(component.text().includes('Sign Out')).toBe(true);
      expect(component.text().includes('Sign In')).toBe(false);
    });

    it('displays the users name', async () => {
      let component: any;
      await act(async () => {
        component = mount(
          <Provider store={store}>
            <MemoryRouter>
              <Header />
            </MemoryRouter>
          </Provider>
        );
      });
      setImmediate(() => {
        component.update();
        expect(component.text().includes('John Doe')).toBe(true);
      });
    });
  });
});
