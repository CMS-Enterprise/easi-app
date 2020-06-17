import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import GovernanceTaskList from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      authService: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: () =>
          Promise.resolve({
            name: 'John Doe'
          })
      }
    };
  }
}));

describe('The Goveranance Task List', () => {
  it('renders without crashing', () => {
    const mockStore = configureMockStore();
    const store = mockStore({});
    shallow(
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Provider store={store}>
          <GovernanceTaskList />
        </Provider>
      </MemoryRouter>
    );
  });

  it('displays only the initial governance steps', async done => {
    const mockStore = configureMockStore();
    const store = mockStore({});
    let component;
    await act(async () => {
      component = mount(
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Provider store={store}>
            <GovernanceTaskList />
          </Provider>
        </MemoryRouter>
      );
    });
    setImmediate(() => {
      component.update();
      expect(
        component.find('ol.governance-task-list__task-list').length
      ).toEqual(1);
      expect(
        component.find('ol.governance-task-list__task-list li').length
      ).toEqual(3);
      done();
    });
  });

  it('displays all governance steps', async done => {
    const mockStore = configureMockStore();
    const store = mockStore({});
    let component;
    await act(async () => {
      component = mount(
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Provider store={store}>
            <GovernanceTaskList />
          </Provider>
        </MemoryRouter>
      );

      component
        .find('.governance-task-list__remaining-steps-btn')
        .simulate('click');
      setImmediate(() => {
        component.update();

        expect(
          component.find('ol.governance-task-list__task-list').length
        ).toEqual(2);
        expect(
          component.find('ol.governance-task-list__task-list li').length
        ).toEqual(8);
        done();
      });
    });
  });
});
