import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';

import { Header } from './index';

jest.mock('@okta/okta-react', () => ({
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
  it('renders without crashing', () => {
    shallow(<Header />);
  });

  describe('When logged in', () => {
    it('displays a login button', () => {
      const component = shallow(<Header />);
      expect(component.text().includes('Sign Out')).toBe(true);
      expect(component.text().includes('Sign In')).toBe(false);
    });

    xit('displays the users name', async done => {
      let component: any;
      await act(async () => {
        component = mount(
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        );
      });
      setImmediate(() => {
        component.update();
        expect(component.text().includes('John Doe')).toBe(true);
        done();
      });
    });
  });

  xit('displays children', () => {
    const component = shallow(
      <Header>
        <div className="test-class-name" />
      </Header>
    );
    expect(component.find('.test-class-name').exists()).toBe(true);
  });
});
