import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';
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

  it('displays all the governance steps', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      systemIntake: { systemIntake: {} },
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
    component!.update();
    expect(
      component!.find('ol.governance-task-list__task-list li').length
    ).toEqual(6);
  });

  describe('Recompetes', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      systemIntake: {
        systemIntake: {
          ...initialSystemIntakeForm,
          requestName: 'Easy Access to System Information',
          requestType: 'RECOMPETE'
        }
      },
      businessCase: { form: {} }
    });
    it('displays "for recompete in title', async () => {
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
      component!.update();

      expect(component!.find('h1').text()).toContain(
        'for re-competing a contract without any changes to systems or services'
      );
    });

    it('displays not applicable steps as cannot start', async () => {
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
      component!.update();

      expect(
        component!
          .find('[data-testid="task-list-business-case-draft"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Cannot start yet');

      expect(
        component!
          .find('[data-testid="task-list-business-case-final"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Cannot start yet');

      expect(
        component!
          .find('[data-testid="task-list-grb-meeting"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Cannot start yet');

      expect(
        component!
          .find('[data-testid="task-list-decision"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Cannot start yet');
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

      expect(component!.find('h1').text()).toContain(
        'for Easy Access to System Information'
      );
    });

    it('hides the request name', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({
        systemIntake: { systemIntake: initialSystemIntakeForm },
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

      expect(component!.find('h1').text()).toEqual('Get governance approval');
    });
  });

  it('renders the side nav actions', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      systemIntake: { systemIntake: {} },
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
    component!.update();
    expect(component!.find('.sidenav-actions').length).toEqual(1);
  });

  describe('Statuses', () => {
    const mockStore = configureMockStore();

    it('renders proper buttons for INTAKE_DRAFT', async () => {
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

      component!.update();
      expect(
        component!.find('[data-testid="intake-start-btn"]').exists()
      ).toEqual(true);

      expect(
        component!
          .find('[data-testid="task-list-intake-review"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Cannot start yet');

      expect(
        component!
          .find('[data-testid="task-list-business-case-draft"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Cannot start yet');
    });

    it('renders proper buttons for INTAKE_SUBMITTED', async () => {
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

      component!.update();
      expect(
        component!.find('[data-testid="intake-view-link"]').exists()
      ).toEqual(true);

      expect(
        component!
          .find('[data-testid="task-list-intake-form"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');

      expect(
        component!
          .find('[data-testid="task-list-business-case-draft"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Cannot start yet');
    });

    it('renders proper buttons for NEED_BIZ_CASE', async () => {
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

      component!.update();
      expect(
        component!.find('[data-testid="start-biz-case-btn"]').exists()
      ).toEqual(true);

      expect(
        component!
          .find('[data-testid="task-list-intake-form"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');

      expect(
        component!
          .find('[data-testid="task-list-intake-review"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');
    });

    it('renders proper buttons for BIZ_CASE_DRAFT', async () => {
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

      component!.update();
      expect(
        component!.find('[data-testid="continue-biz-case-btn"]').exists()
      ).toEqual(true);

      expect(
        component!
          .find('[data-testid="task-list-intake-form"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');

      expect(
        component!
          .find('[data-testid="task-list-intake-review"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');
    });

    it('renders proper buttons for BIZ_CASE_DRAFT_SUBMITTED', async () => {
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

      component!.update();
      expect(
        component!.find('[data-testid="view-biz-case-link"]').exists()
      ).toEqual(true);

      expect(
        component!
          .find('[data-testid="task-list-intake-form"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');

      expect(
        component!
          .find('[data-testid="task-list-intake-review"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');

      expect(
        component!
          .find('[data-testid="task-list-business-case-draft"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');
    });

    it('renders proper buttons for BIZ_CASE_CHANGES_NEEDED', async () => {
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

      component!.update();
      expect(
        component!.find('[data-testid="update-biz-case-draft-btn"]').exists()
      ).toEqual(true);

      expect(
        component!
          .find('[data-testid="task-list-intake-form"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');

      expect(
        component!
          .find('[data-testid="task-list-intake-review"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');
    });

    it('renders proper buttons for BIZ_CASE_FINAL_NEEDED', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'BIZ_CASE_FINAL_NEEDED'
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

      component!.update();

      expect(
        component!
          .find('[data-testid="task-list-business-case-final"]')
          .find(UswdsLink)
          .text()
      ).toEqual('Review and Submit');

      expect(
        component!
          .find('[data-testid="task-list-business-case-draft"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');
    });

    it('renders proper buttons for BIZ_CASE_FINAL_SUBMITTED', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'BIZ_CASE_FINAL_SUBMITTED'
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

      component!.update();
      expect(
        component!
          .find('[data-testid="task-list-business-case-final"]')
          .find(UswdsLink)
          .exists()
      ).toEqual(false);

      expect(
        component!
          .find('[data-testid="task-list-business-case-final"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');
    });

    it('renders proper buttons for READY_FOR_GRB', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'READY_FOR_GRB'
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

      component!.update();

      expect(
        component!
          .find('[data-testid="task-list-grb-meeting"]')
          .find('.governance-task-list__task-tag')
          .exists()
      ).toEqual(false);

      expect(
        component!.find('[data-testid="prepare-for-grb-btn"]').exists()
      ).toEqual(true);
    });
  });
});
