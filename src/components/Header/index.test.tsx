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

    it('displays a login button', async done => {
      let component;
      await act(async () => {
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

    it('displays the users email', async done => {
      let component;

      await act(async () => {
        component = mount(
          <BrowserRouter>
            <Header auth={auth} />
          </BrowserRouter>
        );
      });

      setImmediate(() => {
        component.update();
        expect(component.text().includes('test@test.com')).toBe(true);
        done();
      });
    });
  });

  describe('When contains a secondary navigation list', () => {
    const auth = {
      isAuthenticated: () => Promise.resolve(true),
      user: {
        email: ''
      }
    };

    const mockSystems: any[] = [
      { id: '1', name: 'System1', slug: 'system1', link: '/system/system1' },
      { id: '2', name: 'System2', slug: 'system2', link: '/system/system2' },
      { id: '3', name: 'System3', slug: 'system3', link: '/system/system3' },
      { id: '4', name: 'System4', slug: 'system4', link: '/system/system4' },
      { id: '5', name: 'System5', slug: 'system5', link: '/system/system5' }
    ];

    it('displays secondary navigation links in desktop', () => {
      const component = shallow(
        <Header
          auth={auth}
          secondaryNavList={mockSystems}
          activeNavListItem="system1"
        />
      );

      expect(component.find('[data-testid="header-nav-item"]').length).toEqual(
        mockSystems.length
      );
    });
  });
});
