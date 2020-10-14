import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import { initialSystemIntakeForm } from 'data/systemIntake';
import { closedIntakeStatuses, openIntakeStatuses } from 'types/systemIntake';

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
  it('shows open status', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      systemIntake: {
        systemIntake: {
          ...initialSystemIntakeForm,
          status:
            openIntakeStatuses[
              Math.floor(Math.random() * openIntakeStatuses.length)
            ]
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
      systemIntake: {
        systemIntake: {
          ...initialSystemIntakeForm,
          status:
            closedIntakeStatuses[
              Math.floor(Math.random() * closedIntakeStatuses.length)
            ]
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
      systemIntake: {
        systemIntake: {
          ...initialSystemIntakeForm,
          status:
            closedIntakeStatuses[
              Math.floor(Math.random() * closedIntakeStatuses.length)
            ],
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
