import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mount, ReactWrapper } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import { initialSystemIntakeForm } from 'data/systemIntake';

import RequestOverview from './requestOverview';

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

describe('The GRT Review page', () => {
  it('shows open status', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        groups: ['EASI_D_GOVTEAM'],
        isUserSet: true
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

    let component: ReactWrapper;
    await act(async () => {
      component = mount(
        <MemoryRouter>
          <Provider store={store}>
            <RequestOverview />
          </Provider>
        </MemoryRouter>
      );
    });
    expect(component!.find('[data-testid="grt-status"]').text()).toEqual(
      'Open'
    );
  });

  it('shows closed status', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        groups: ['EASI_D_GOVTEAM'],
        isUserSet: true
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

    let component: ReactWrapper;
    await act(async () => {
      component = mount(
        <MemoryRouter>
          <Provider store={store}>
            <RequestOverview />
          </Provider>
        </MemoryRouter>
      );
    });
    expect(component!.find('[data-testid="grt-status"]').text()).toEqual(
      'Closed'
    );
  });

  it('shows lifecycle id if it exists', async () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      auth: {
        groups: ['EASI_D_GOVTEAM'],
        isUserSet: true
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

    let component: ReactWrapper;
    await act(async () => {
      component = mount(
        <MemoryRouter>
          <Provider store={store}>
            <RequestOverview />
          </Provider>
        </MemoryRouter>
      );
    });
    expect(component!.find('[data-testid="grt-lcid"]').text()).toEqual('12345');
  });
});
