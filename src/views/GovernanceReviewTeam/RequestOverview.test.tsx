import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { shallow, ShallowWrapper } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import { initialSystemIntakeForm } from 'data/systemIntake';

import RequestOverview from './RequestOverview';

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
  it('renders the Summary component', async () => {
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

    let component: ShallowWrapper;
    await act(async () => {
      component = shallow(
        <MemoryRouter>
          <Provider store={store}>
            <RequestOverview />
          </Provider>
        </MemoryRouter>
      );
    });
    expect(component!.find('Summary').exists()).toBeFalsy();
  });
});
