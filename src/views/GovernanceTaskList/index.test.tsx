import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
// import { mount, ReactWrapper, shallow } from 'enzyme';
import { render, screen, within } from '@testing-library/react';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import configureMockStore from 'redux-mock-store';

import { initialSystemIntakeForm } from 'data/systemIntake';
import { MessageProvider } from 'hooks/useMessage';

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
  it('renders without crashing', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      systemIntake: { systemIntake: {} },
      businessCase: { form: {} }
    });
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Provider store={store}>
            <MessageProvider>
              <GovernanceTaskList />
            </MessageProvider>
          </Provider>
        </MemoryRouter>
      );
    });
  });

  it('displays all the governance steps', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      systemIntake: { systemIntake: {} },
      businessCase: { form: {} }
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Provider store={store}>
            <MessageProvider>
              <GovernanceTaskList />
            </MessageProvider>
          </Provider>
        </MemoryRouter>
      );
    });
    const taskList = screen.getByTestId('task-list');
    expect(taskList).toBeInTheDocument();
    expect(
      within(taskList).getByTestId('task-list-intake-form')
    ).toBeInTheDocument();
    expect(
      within(taskList).getByTestId('task-list-intake-review')
    ).toBeInTheDocument();
    expect(
      within(taskList).getByTestId('task-list-business-case-draft')
    ).toBeInTheDocument();
    expect(
      within(taskList).getByTestId('task-list-business-case-final')
    ).toBeInTheDocument();
    expect(
      within(taskList).getByTestId('task-list-grb-meeting')
    ).toBeInTheDocument();
    expect(
      within(taskList).getByTestId('task-list-decision')
    ).toBeInTheDocument();
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

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <GovernanceTaskList />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      });

      expect(
        screen.getByRole('heading', {
          name:
            'Get governance approval for re-competing a contract without any changes to systems or services',
          level: 1
        })
      ).toBeInTheDocument();
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

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <GovernanceTaskList />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      });

      expect(
        screen.getByTestId('task-list-business-case-draft').textContent
      ).toContain('Cannot start yet');
      expect(
        screen.getByTestId('task-list-business-case-final').textContent
      ).toContain('Cannot start yet');
      expect(screen.getByTestId('task-list-grb-meeting').textContent).toContain(
        'Cannot start yet'
      );
      expect(screen.getByTestId('task-list-decision').textContent).toContain(
        'Cannot start yet'
      );
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

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <GovernanceTaskList />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      });

      expect(screen.getByTestId('task-list-intake-form').textContent).toContain(
        'Completed'
      );
      expect(
        screen.getByTestId('task-list-intake-review').textContent
      ).toContain('Completed');
      expect(
        screen.getByTestId('task-list-business-case-draft').textContent
      ).toContain('Not needed');
      expect(
        screen.getByTestId('task-list-business-case-final').textContent
      ).toContain('Not needed');
      expect(screen.getByTestId('task-list-grb-meeting').textContent).toContain(
        'Not needed'
      );
      expect(screen.getByTestId('task-list-decision').textContent).toContain(
        'Read decision from board'
      );
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
      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <GovernanceTaskList />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      });

      expect(
        screen.getByRole('heading', {
          name: 'Get governance approval for Easy Access to System Information',
          level: 1
        })
      ).toBeInTheDocument();
    });

    it('hides the request name', async () => {
      const mockStore = configureMockStore();
      const store = mockStore({
        systemIntake: { systemIntake: initialSystemIntakeForm },
        businessCase: { form: {} }
      });

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <GovernanceTaskList />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      });
      expect(
        screen.getByRole('heading', {
          name: 'Get governance approval',
          level: 1
        })
      ).toBeInTheDocument();
    });
  });

  it('renders the side nav actions', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      systemIntake: { systemIntake: initialSystemIntakeForm },
      businessCase: { form: {} }
    });
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Provider store={store}>
            <MessageProvider>
              <GovernanceTaskList />
            </MessageProvider>
          </Provider>
        </MemoryRouter>
      );
    });
    expect(screen.getByTestId('sidenav-actions')).toBeInTheDocument();
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

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <GovernanceTaskList />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      });

      expect(screen.getByTestId('intake-start-btn')).toBeInTheDocument();

      expect(
        screen.getByTestId('task-list-intake-review').textContent
      ).toContain('Cannot start yet');

      expect(
        screen.getByTestId('task-list-business-case-draft').textContent
      ).toContain('Cannot start yet');
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

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <GovernanceTaskList />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      });

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();

      expect(screen.getByTestId('task-list-intake-form').textContent).toContain(
        'Completed'
      );

      const initialReview = screen.getByTestId('task-list-intake-review');
      expect(
        within(initialReview).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();

      expect(
        screen.getByTestId('task-list-business-case-draft').textContent
      ).toContain('Cannot start yet');
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

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <GovernanceTaskList />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      });
      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(screen.getByTestId('start-biz-case-btn')).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      const bizCase = screen.getByTestId('task-list-business-case-draft');
      expect(
        within(bizCase).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();
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

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <GovernanceTaskList />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      });

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(screen.getByTestId('continue-biz-case-btn')).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      const bizCase = screen.getByTestId('task-list-business-case-draft');
      expect(
        within(bizCase).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();
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

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <GovernanceTaskList />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      });

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(screen.getByTestId('view-biz-case-link')).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-business-case-draft')).getByTestId(
          'task-list-task-tag'
        ).textContent
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

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <GovernanceTaskList />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      });

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(
        screen.getByTestId('update-biz-case-draft-btn')
      ).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      const bizCase = screen.getByTestId('task-list-business-case-draft');
      expect(
        within(bizCase).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();
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

      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Provider store={store}>
              <MessageProvider>
                <GovernanceTaskList />
              </MessageProvider>
            </Provider>
          </MemoryRouter>
        );
      });

      expect(screen.getByTestId('intake-view-link')).toBeInTheDocument();
      expect(screen.getByTestId('prepare-for-grt-cta')).toBeInTheDocument();
      expect(screen.getByTestId('view-biz-case-cta')).toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-intake-form')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      expect(
        within(screen.getByTestId('task-list-intake-review')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Completed');

      const bizCase = screen.getByTestId('task-list-business-case-draft');
      expect(
        within(bizCase).queryByTestId('task-list-task-tag')
      ).not.toBeInTheDocument();

      expect(
        within(screen.getByTestId('task-list-business-case-final')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Cannot start yet');

      expect(
        within(screen.getByTestId('task-list-grb-meeting')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Cannot start yet');

      expect(
        within(screen.getByTestId('task-list-decision')).getByTestId(
          'task-list-task-tag'
        ).textContent
      ).toEqual('Cannot start yet');
    });

    //   it('renders proper buttons for BIZ_CASE_FINAL_NEEDED', async () => {
    //     const store = mockStore({
    //       systemIntake: {
    //         systemIntake: {
    //           ...initialSystemIntakeForm,
    //           status: 'BIZ_CASE_FINAL_NEEDED'
    //         }
    //       },
    //       businessCase: { form: {} }
    //     });
    //     let component: ReactWrapper;

    //     await act(async () => {
    //       component = render(
    //         <MemoryRouter initialEntries={['/']} initialIndex={0}>
    //           <Provider store={store}>
    //             <MessageProvider>
    //               <GovernanceTaskList />
    //             </MessageProvider>
    //           </Provider>
    //         </MemoryRouter>
    //       );
    //     });

    //     component!.update();
    //     expect(
    //       component!.find('[data-testid="intake-view-link"]').exists()
    //     ).toEqual(true);

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-business-case-final"]')
    //         .find(UswdsLink)
    //         .text()
    //     ).toEqual('Review and Submit');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-intake-form"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-intake-review"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-business-case-draft"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-business-case-final"]')
    //         .find('.governance-task-list__task-tag')
    //         .exists()
    //     ).toEqual(false);
    //   });

    //   it('renders proper buttons for BIZ_CASE_FINAL_SUBMITTED', async () => {
    //     const store = mockStore({
    //       systemIntake: {
    //         systemIntake: {
    //           ...initialSystemIntakeForm,
    //           status: 'BIZ_CASE_FINAL_SUBMITTED'
    //         }
    //       },
    //       businessCase: { form: {} }
    //     });
    //     let component: ReactWrapper;

    //     await act(async () => {
    //       component = render(
    //         <MemoryRouter initialEntries={['/']} initialIndex={0}>
    //           <Provider store={store}>
    //             <MessageProvider>
    //               <GovernanceTaskList />
    //             </MessageProvider>
    //           </Provider>
    //         </MemoryRouter>
    //       );
    //     });

    //     component!.update();
    //     expect(
    //       component!.find('[data-testid="intake-view-link"]').exists()
    //     ).toEqual(true);

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-business-case-final"]')
    //         .find(UswdsLink)
    //         .exists()
    //     ).toEqual(false);

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-intake-form"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-intake-review"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-business-case-draft"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-business-case-final"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');
    //   });

    //   it('renders proper buttons for READY_FOR_GRB', async () => {
    //     const store = mockStore({
    //       systemIntake: {
    //         systemIntake: {
    //           ...initialSystemIntakeForm,
    //           status: 'READY_FOR_GRB'
    //         }
    //       },
    //       businessCase: { form: {} }
    //     });
    //     let component: ReactWrapper;

    //     await act(async () => {
    //       component = render(
    //         <MemoryRouter initialEntries={['/']} initialIndex={0}>
    //           <Provider store={store}>
    //             <MessageProvider>
    //               <GovernanceTaskList />
    //             </MessageProvider>
    //           </Provider>
    //         </MemoryRouter>
    //       );
    //     });

    //     component!.update();
    //     expect(
    //       component!.find('[data-testid="intake-view-link"]').exists()
    //     ).toEqual(true);

    //     expect(
    //       component!.find('[data-testid="prepare-for-grb-btn"]').exists()
    //     ).toEqual(true);

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-intake-form"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-intake-review"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-business-case-draft"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-business-case-final"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-grb-meeting"]')
    //         .find('.governance-task-list__task-tag')
    //         .exists()
    //     ).toEqual(false);
    //   });

    //   it('renders proper buttons for LCID_ISSUED', async () => {
    //     const store = mockStore({
    //       systemIntake: {
    //         systemIntake: {
    //           ...initialSystemIntakeForm,
    //           status: 'LCID_ISSUED'
    //         }
    //       },
    //       businessCase: { form: {} }
    //     });
    //     let component: ReactWrapper;

    //     await act(async () => {
    //       component = render(
    //         <MemoryRouter initialEntries={['/']} initialIndex={0}>
    //           <Provider store={store}>
    //             <MessageProvider>
    //               <GovernanceTaskList />
    //             </MessageProvider>
    //           </Provider>
    //         </MemoryRouter>
    //       );
    //     });

    //     component!.update();
    //     expect(
    //       component!.find('[data-testid="intake-view-link"]').exists()
    //     ).toEqual(true);

    //     expect(component!.find('[data-testid="decision-cta"]').exists()).toEqual(
    //       true
    //     );

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-intake-form"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-intake-review"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-business-case-draft"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-business-case-final"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-grb-meeting"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-decision"]')
    //         .find('.governance-task-list__task-tag')
    //         .exists()
    //     ).toEqual(false);
    //   });

    //   it('renders proper buttons for NO_GOVERNANCE', async () => {
    //     const store = mockStore({
    //       systemIntake: {
    //         systemIntake: {
    //           ...initialSystemIntakeForm,
    //           status: 'NO_GOVERNANCE'
    //         }
    //       },
    //       businessCase: { form: {} }
    //     });
    //     let component: ReactWrapper;

    //     await act(async () => {
    //       component = render(
    //         <MemoryRouter initialEntries={['/']} initialIndex={0}>
    //           <Provider store={store}>
    //             <MessageProvider>
    //               <GovernanceTaskList />
    //             </MessageProvider>
    //           </Provider>
    //         </MemoryRouter>
    //       );
    //     });

    //     component!.update();
    //     expect(
    //       component!.find('[data-testid="intake-view-link"]').exists()
    //     ).toEqual(true);

    //     expect(
    //       component!.find('[data-testid="task-list-closed-alert"]').exists()
    //     ).toEqual(true);

    //     expect(
    //       component!
    //         .find('[data-testid="plain-text-no-governance-decision"]')
    //         .exists()
    //     ).toEqual(true);

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-intake-form"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-intake-review"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Cannot start yet');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-grb-meeting"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');
    //   });

    //   it('renders proper buttons for NOT_IT_REQUEST', async () => {
    //     const store = mockStore({
    //       systemIntake: {
    //         systemIntake: {
    //           ...initialSystemIntakeForm,
    //           status: 'NOT_IT_REQUEST'
    //         }
    //       },
    //       businessCase: { form: {} }
    //     });
    //     let component: ReactWrapper;

    //     await act(async () => {
    //       component = render(
    //         <MemoryRouter initialEntries={['/']} initialIndex={0}>
    //           <Provider store={store}>
    //             <MessageProvider>
    //               <GovernanceTaskList />
    //             </MessageProvider>
    //           </Provider>
    //         </MemoryRouter>
    //       );
    //     });

    //     component!.update();
    //     expect(
    //       component!.find('[data-testid="intake-view-link"]').exists()
    //     ).toEqual(true);

    //     expect(
    //       component!.find('[data-testid="task-list-closed-alert"]').exists()
    //     ).toEqual(true);

    //     expect(
    //       component!
    //         .find('[data-testid="plain-text-not-it-request-decision"]')
    //         .exists()
    //     ).toEqual(true);

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-intake-form"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-intake-review"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');

    //     expect(
    //       component!
    //         .find('[data-testid="task-list-grb-meeting"]')
    //         .find('.governance-task-list__task-tag')
    //         .text()
    //     ).toEqual('Completed');
    //   });
  });
});
