import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mount, ReactWrapper, shallow } from 'enzyme';
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

  describe('Statuses', () => {
    const mockStore = configureMockStore();

    it('renders proper buttons for INTAKE_DRAFT', async done => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'INTAKE_DRAFT'
          }
        },
        businessCase: { form: {} }
      });
      let component: ReactWrapper;

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
          component.find('[data-testid="intake-start-btn"]').exists()
        ).toEqual(true);

        expect(
          component
            .find('[data-testid="task-list-intake-review"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Cannot start yet');

        expect(
          component
            .find('[data-testid="task-list-business-case-draft"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Cannot start yet');
        done();
      });
    });

    it('renders proper buttons for INTAKE_SUBMITTED', async done => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'INTAKE_SUBMITTED'
          }
        },
        businessCase: { form: {} }
      });
      let component: ReactWrapper;

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
          component.find('[data-testid="intake-view-link"]').exists()
        ).toEqual(true);

        expect(
          component
            .find('[data-testid="task-list-intake-form"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Completed');

        expect(
          component
            .find('[data-testid="task-list-business-case-draft"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Cannot start yet');

        done();
      });
    });

    it('renders proper buttons for NEED_BIZ_CASE', async done => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'NEED_BIZ_CASE'
          }
        },
        businessCase: { form: {} }
      });
      let component: ReactWrapper;

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
          component.find('[data-testid="start-biz-case-btn"]').exists()
        ).toEqual(true);

        expect(
          component
            .find('[data-testid="task-list-intake-form"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Completed');

        expect(
          component
            .find('[data-testid="task-list-intake-review"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Completed');

        done();
      });
    });

    it('renders proper buttons for BIZ_CASE_DRAFT', async done => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'BIZ_CASE_DRAFT'
          }
        },
        businessCase: { form: {} }
      });
      let component: ReactWrapper;

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
          component.find('[data-testid="continue-biz-case-btn"]').exists()
        ).toEqual(true);

        expect(
          component
            .find('[data-testid="task-list-intake-form"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Completed');

        expect(
          component
            .find('[data-testid="task-list-intake-review"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Completed');
        done();
      });
    });

    it('renders proper buttons for BIZ_CASE_DRAFT_SUBMITTED', async done => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'BIZ_CASE_DRAFT_SUBMITTED'
          }
        },
        businessCase: { form: {} }
      });
      let component: ReactWrapper;

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
          component.find('[data-testid="view-biz-case-link"]').exists()
        ).toEqual(true);

        expect(
          component
            .find('[data-testid="task-list-intake-form"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Completed');

        expect(
          component
            .find('[data-testid="task-list-intake-review"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Completed');

        expect(
          component
            .find('[data-testid="task-list-business-case-draft"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Completed');
        done();
      });
    });

    it('renders proper buttons for BIZ_CASE_CHANGES_NEEDED', async done => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'BIZ_CASE_CHANGES_NEEDED'
          }
        },
        businessCase: { form: {} }
      });
      let component: ReactWrapper;

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
          component.find('[data-testid="update-biz-case-draft"]').exists()
        ).toEqual(true);

        expect(
          component
            .find('[data-testid="task-list-intake-form"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Completed');

        expect(
          component
            .find('[data-testid="task-list-intake-review"]')
            .find('.governance-task-list__task-tag')
            .text()
        ).toEqual('Completed');

        done();
      });
    });
  });
});
