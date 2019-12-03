import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Header } from './index';

describe('The Header component', () => {
  it('renders without crashing', () => {
    const auth = {
      isAuthenticated: () => Promise.resolve(true),
      user: {
        email: ' '
      }
    };
    shallow(<Header auth={auth} />);
  });

  describe('When logged out', () => {
    const auth = {
      isAuthenticated: () => Promise.resolve(false),
      user: {
        email: ''
      }
    };
    it('displays a login button', () => {
      const component = shallow(<Header auth={auth} />);
      expect(component.text().includes('Login')).toBe(true);
      expect(component.text().includes('Logout')).toBe(false);
    });
  });

  describe('When logged in', () => {
    const auth = {
      isAuthenticated: () => Promise.resolve(true),
      getUser: () =>
        Promise.resolve({
          email: 'test@test.com'
        })
    };

    it('displays a login button', done => {
      let component;
      act(() => {
        component = mount(
          <BrowserRouter>
            <Header auth={auth} />
          </BrowserRouter>
        );
      });

      setImmediate(() => {
        component.update();
        expect(component.text().includes('Logout')).toBe(true);
        expect(component.text().includes('Login')).toBe(false);
        done();
      });
    });

    it('displays the users email', done => {
      const component = mount(
        <BrowserRouter>
          <Header auth={auth} />
        </BrowserRouter>
      );

      setImmediate(() => {
        component.update();
        expect(component.text().includes('test@test.com')).toBe(true);
        done();
      });
    });
  });
});
