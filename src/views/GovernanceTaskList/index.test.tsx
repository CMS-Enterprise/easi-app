import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { initialSystemIntakeForm } from 'data/systemIntake';
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
    const store = mockStore({
      systemIntake: { systemIntake: {} },
      businessCase: { form: {} }
    });
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
    const store = mockStore({
      systemIntake: { systemIntake: {} },
      businessCase: { form: {} }
    });
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
        .find('button[data-testid="remaining-steps-btn"]')
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

  describe('Heading', () => {
    it('displays the request name', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            requestName: 'Easy Access to System Information'
          }
        },
        businessCase: { form: {} }
      });
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

      expect(component.find('h1').text()).toContain(
        'for Easy Access to System Information'
      );
    });
    it('hides the request name', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({
        systemIntake: { systemIntake: initialSystemIntakeForm },
        businessCase: { form: {} }
      });
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

      expect(component.find('h1').text()).toEqual('Get governance approval');
    });
  });

  it('renders the side nav actions', async done => {
    const mockStore = configureMockStore();
    const store = mockStore({
      systemIntake: { systemIntake: {} },
      businessCase: { form: {} }
    });
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
      expect(component.find('.sidenav-actions').length).toEqual(1);
      done();
    });
  });

  describe('Governance Task List Accessibility', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      systemIntake: { systemIntake: {} },
      businessCase: { form: {} }
    });
    let component;
    it('button expansion is tied to the secondary ordered list', async done => {
      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <GovernanceTaskList />
            </Provider>
          </MemoryRouter>
        );

        const id = 'GovernanceTaskList-SecondaryList';
        component
          .find('button[data-testid="remaining-steps-btn"]')
          .simulate('click');
        setImmediate(() => {
          component.update();
          expect(
            component.find(`button[aria-controls="${id}"]`).exists()
          ).toEqual(true);
          expect(component.find(`ol#${id}`).exists()).toEqual(true);
          done();
        });
      });
    });

    it('renders aria-expanded/label correctly', async done => {
      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <GovernanceTaskList />
            </Provider>
          </MemoryRouter>
        );

        expect(
          component.find('button[data-testid="remaining-steps-btn"]').text()
        ).toEqual('Show remaining steps');
        expect(
          component
            .find('button[data-testid="remaining-steps-btn"]')
            .prop('aria-expanded')
        ).toEqual(false);
        component
          .find('button[data-testid="remaining-steps-btn"]')
          .simulate('click');

        setImmediate(() => {
          component.update();
          expect(
            component.find('button[data-testid="remaining-steps-btn"]').text()
          ).toEqual('Hide remaining steps');
          expect(
            component
              .find('button[data-testid="remaining-steps-btn"]')
              .prop('aria-expanded')
          ).toEqual(true);
          done();
        });
      });
    });
  });
});
