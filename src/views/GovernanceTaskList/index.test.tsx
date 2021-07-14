import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import { mount, ReactWrapper, shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import { initialSystemIntakeForm } from 'data/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import GetSytemIntakeQuery from 'queries/GetSystemIntakeQuery';

import GovernanceTaskList from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
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
  const mocks = (intakeProps: any) => {
    return [
      {
        request: {
          query: GetSytemIntakeQuery,
          variables: {
            id: 'sysIntakeRequest123'
          }
        },
        result: {
          data: {
            systemIntake: {
              id: 'sysIntakeRequest123',
              ...intakeProps
            }
          }
        }
      }
    ];
  };

  it('renders without crashing', () => {
    const mockStore = configureMockStore();
    const store = mockStore({});
    shallow(
      <MemoryRouter
        initialEntries={['/governance-task-list/sysIntakeRequest123']}
      >
        <MockedProvider mocks={mocks({})} addTypename={false}>
          <Provider store={store}>
            <MessageProvider>
              <Route path="/governance-task-list/:systemId">
                <GovernanceTaskList />
              </Route>
            </MessageProvider>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );
  });

  it('displays all the governance steps', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({});
    let component: ReactWrapper;
    await act(async () => {
      component = mount(
        <MemoryRouter
          initialEntries={['/governance-task-list/sysIntakeRequest123']}
        >
          <MockedProvider mocks={mocks({})} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      component.update();
    });
    expect(
      component!.find('ol.governance-task-list__task-list li').length
    ).toEqual(6);
  });

  describe('Recompetes', () => {
    it('displays "for recompete in title', async () => {
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

      const mockWithType = mocks({
        requestName: 'Easy Access to System Information',
        requestType: 'RECOMPETE'
      });

      let component: ReactWrapper;
      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithType} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

      expect(component!.find('h1').text()).toContain(
        'for re-competing a contract without any changes to systems or services'
      );
    });

    it('displays not applicable steps as cannot start', async () => {
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
      const mockWithType = mocks({
        requestName: 'Easy Access to System Information',
        requestType: 'RECOMPETE'
      });

      let component: ReactWrapper;
      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithType} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

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

    it('displays steps 3, 4, and 5 as not needed once issued LCID', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            requestName: 'Easy Access to System Information',
            requestType: 'RECOMPETE',
            status: 'LCID_ISSUED'
          }
        },
        businessCase: { form: {} }
      });
      const mockWithType = mocks({
        requestName: 'Easy Access to System Information',
        requestType: 'RECOMPETE'
      });

      let component: ReactWrapper;
      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithType} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

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
      ).toEqual('Not needed');

      expect(
        component!
          .find('[data-testid="task-list-business-case-final"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Not needed');

      expect(
        component!
          .find('[data-testid="task-list-grb-meeting"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Not needed');

      expect(
        component!
          .find('[data-testid="task-list-decision"]')
          .find('.governance-task-list__task-tag')
          .exists()
      ).toEqual(false);
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
      const mockWithName = mocks({
        requestName: 'Easy Access to System Information'
      });
      let component: ReactWrapper;
      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithName} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
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
            <MockedProvider mocks={mocks({})} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
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
          <MockedProvider mocks={mocks({})} addTypename={false}>
            <Provider store={store}>
              <MessageProvider>
                <Route path="/governance-task-list/:systemId">
                  <GovernanceTaskList />
                </Route>
              </MessageProvider>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      component.update();
    });
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
      const mockWithStatus = mocks({
        status: 'INTAKE_DRAFT'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

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
      const mockWithStatus = mocks({
        status: 'INTAKE_SUBMITTED'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

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
          .find('[data-testid="task-list-intake-review"]')
          .find('.governance-task-list__task-tag')
          .exists()
      ).toEqual(false);

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
      const mockWithStatus = mocks({
        status: 'NEED_BIZ_CASE'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

      expect(
        component!.find('[data-testid="intake-view-link"]').exists()
      ).toEqual(true);

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

      expect(
        component!
          .find('[data-testid="task-list-business-case-draft"]')
          .find('.governance-task-list__task-tag')
          .exists()
      ).toEqual(false);
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
      const mockWithStatus = mocks({
        status: 'BIZ_CASE_DRAFT'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

      expect(
        component!.find('[data-testid="intake-view-link"]').exists()
      ).toEqual(true);

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

      expect(
        component!
          .find('[data-testid="task-list-business-case-draft"]')
          .find('.governance-task-list__task-tag')
          .exists()
      ).toEqual(false);
    });

    it('renders proper buttons for BIZ_CASE_DRAFT_SUBMITTED', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'BIZ_CASE_DRAFT_SUBMITTED',
            businessCaseId: 'ac94c1d7-48ca-4c49-9045-371b4d3062b4'
          }
        },
        businessCase: { form: {} }
      });
      const mockWithStatus = mocks({
        status: 'BIZ_CASE_DRAFT_SUBMITTED',
        businessCaseId: 'ac94c1d7-48ca-4c49-9045-371b4d3062b4'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

      expect(
        component!.find('[data-testid="intake-view-link"]').exists()
      ).toEqual(true);

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
      const mockWithStatus = mocks({
        status: 'BIZ_CASE_CHANGES_NEEDED'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

      expect(
        component!.find('[data-testid="intake-view-link"]').exists()
      ).toEqual(true);

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

      expect(
        component!
          .find('[data-testid="task-list-business-case-draft"]')
          .find('.governance-task-list__task-tag')
          .exists()
      ).toEqual(false);
    });

    it('renders proper buttons for READY_FOR_GRT', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'READY_FOR_GRT'
          }
        },
        businessCase: { form: {} }
      });
      const mockWithStatus = mocks({
        status: 'READY_FOR_GRT'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

      expect(
        component!.find('[data-testid="intake-view-link"]').exists()
      ).toEqual(true);

      expect(
        component!.find('[data-testid="prepare-for-grt-cta"]').exists()
      ).toEqual(true);

      expect(
        component!.find('[data-testid="view-biz-case-cta"]').exists()
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
          .exists()
      ).toEqual(false);

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
      const mockWithStatus = mocks({
        status: 'BIZ_CASE_FINAL_NEEDED'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

      expect(
        component!.find('[data-testid="intake-view-link"]').exists()
      ).toEqual(true);

      expect(
        component!
          .find('[data-testid="task-list-business-case-final"]')
          .find(UswdsLink)
          .text()
      ).toEqual('Review and Submit');

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

      expect(
        component!
          .find('[data-testid="task-list-business-case-final"]')
          .find('.governance-task-list__task-tag')
          .exists()
      ).toEqual(false);
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
      const mockWithStatus = mocks({
        status: 'BIZ_CASE_FINAL_SUBMITTED'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

      expect(
        component!.find('[data-testid="intake-view-link"]').exists()
      ).toEqual(true);

      expect(
        component!
          .find('[data-testid="task-list-business-case-final"]')
          .find(UswdsLink)
          .exists()
      ).toEqual(false);

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
      const mockWithStatus = mocks({
        status: 'READY_FOR_GRB'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

      expect(
        component!.find('[data-testid="intake-view-link"]').exists()
      ).toEqual(true);

      expect(
        component!.find('[data-testid="prepare-for-grb-btn"]').exists()
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

      expect(
        component!
          .find('[data-testid="task-list-business-case-final"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');

      expect(
        component!
          .find('[data-testid="task-list-grb-meeting"]')
          .find('.governance-task-list__task-tag')
          .exists()
      ).toEqual(false);
    });

    it('renders proper buttons for LCID_ISSUED', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'LCID_ISSUED'
          }
        },
        businessCase: { form: {} }
      });
      const mockWithStatus = mocks({
        status: 'LCID_ISSUED'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

      expect(
        component!.find('[data-testid="intake-view-link"]').exists()
      ).toEqual(true);

      expect(component!.find('[data-testid="decision-cta"]').exists()).toEqual(
        true
      );

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

      expect(
        component!
          .find('[data-testid="task-list-business-case-final"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');

      expect(
        component!
          .find('[data-testid="task-list-grb-meeting"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');

      expect(
        component!
          .find('[data-testid="task-list-decision"]')
          .find('.governance-task-list__task-tag')
          .exists()
      ).toEqual(false);
    });

    it('renders proper buttons for NO_GOVERNANCE', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'NO_GOVERNANCE'
          }
        },
        businessCase: { form: {} }
      });

      const mockWithStatus = mocks({
        status: 'NO_GOVERNANCE'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

      expect(
        component!.find('[data-testid="intake-view-link"]').exists()
      ).toEqual(true);

      expect(
        component!.find('[data-testid="task-list-closed-alert"]').exists()
      ).toEqual(true);

      expect(
        component!
          .find('[data-testid="plain-text-no-governance-decision"]')
          .exists()
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
      ).toEqual('Cannot start yet');

      expect(
        component!
          .find('[data-testid="task-list-grb-meeting"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');
    });

    it('renders proper buttons for NOT_IT_REQUEST', async () => {
      const store = mockStore({
        systemIntake: {
          systemIntake: {
            ...initialSystemIntakeForm,
            status: 'NOT_IT_REQUEST'
          }
        },
        businessCase: { form: {} }
      });
      const mockWithStatus = mocks({
        status: 'NOT_IT_REQUEST'
      });
      let component: ReactWrapper;

      await act(async () => {
        component = mount(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <MockedProvider mocks={mockWithStatus} addTypename={false}>
              <Provider store={store}>
                <MessageProvider>
                  <Route path="/governance-task-list/:systemId">
                    <GovernanceTaskList />
                  </Route>
                </MessageProvider>
              </Provider>
            </MockedProvider>
          </MemoryRouter>
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        component.update();
      });

      expect(
        component!.find('[data-testid="intake-view-link"]').exists()
      ).toEqual(true);

      expect(
        component!.find('[data-testid="task-list-closed-alert"]').exists()
      ).toEqual(true);

      expect(
        component!
          .find('[data-testid="plain-text-not-it-request-decision"]')
          .exists()
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
          .find('[data-testid="task-list-grb-meeting"]')
          .find('.governance-task-list__task-tag')
          .text()
      ).toEqual('Completed');
    });
  });
});
