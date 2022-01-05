import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { mount, shallow } from 'enzyme';

import { Header } from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: () =>
          Promise.resolve({
            name: 'John Doe'
          }),
        logout: async () => {}
      }
    };
  }
}));

describe('The Header component', () => {
  xit('renders without crashing', () => {
    shallow(<Header />);
  });

  describe('When logged in', () => {
    xit('displays a login button', async done => {
      let component: any;
      await act(async () => {
        component = render(
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        );
      });

      expect(component.getByText('Sign Out')).toBeInTheDocument();
      expect(component.getByText('Sign In')).toBeInTheDocument();
      done();
    });

    it('displays the users name', async () => {
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
        expect(component.text().includes('Sign Out')).toBe(true);
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
