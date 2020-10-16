import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import { initialSystemIntakeForm } from 'data/systemIntake';

import GovernanceReviewTeam from './index';

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

describe('The GRT Review page', () => {
  it('renders nothing if the user does not have the proper group', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        groups: [],
        userGroupsSet: true
      },
      systemIntake: {
        systemIntake: {
          ...initialSystemIntakeForm,
          lcid: '12345'
        }
      },
      businessCase: {
        form: {}
      }
    });

    const component = mount(
      <MemoryRouter>
        <Provider store={store}>
          <GovernanceReviewTeam />
        </Provider>
      </MemoryRouter>
    );

    expect(component.text()).toEqual('');
  });

  it('shows open status', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        groups: ['EASI_D_GOVTEAM'],
        userGroupsSet: true
      },
      systemIntake: {
        systemIntake: {
          ...initialSystemIntakeForm,
          status: 'INTAKE_SUBMITTED'
        }
      },
      businessCase: {
        form: {}
      }
    });

    const component = mount(
      <MemoryRouter>
        <Provider store={store}>
          <GovernanceReviewTeam />
        </Provider>
      </MemoryRouter>
    );
    expect(component.find('[data-testid="grt-status"]').text()).toEqual('Open');
  });

  it('shows closed status', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        groups: ['EASI_D_GOVTEAM'],
        userGroupsSet: true
      },
      systemIntake: {
        systemIntake: {
          ...initialSystemIntakeForm,
          status: 'LCID_ISSUED'
        }
      },
      businessCase: {
        form: {}
      }
    });

    const component = mount(
      <MemoryRouter>
        <Provider store={store}>
          <GovernanceReviewTeam />
        </Provider>
      </MemoryRouter>
    );
    expect(component.find('[data-testid="grt-status"]').text()).toEqual(
      'Closed'
    );
  });

  it('shows lifecycle id if it exists', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        groups: ['EASI_D_GOVTEAM'],
        userGroupsSet: true
      },
      systemIntake: {
        systemIntake: {
          ...initialSystemIntakeForm,
          lcid: '12345'
        }
      },
      businessCase: {
        form: {}
      }
    });

    const component = mount(
      <MemoryRouter>
        <Provider store={store}>
          <GovernanceReviewTeam />
        </Provider>
      </MemoryRouter>
    );

    expect(component.find('[data-testid="grt-lcid"]').text()).toEqual('12345');
  });
});
