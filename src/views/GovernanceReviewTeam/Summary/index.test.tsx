import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { mount, ReactWrapper } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import { initialSystemIntakeForm } from 'data/systemIntake';

import Summary from '.';

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

const renderComponent = (intake: any) => {
  const mockStore = configureMockStore();
  return mount(
    <MemoryRouter>
      <Provider store={mockStore()}>
        <MockedProvider>
          <Summary intake={intake} />
        </MockedProvider>
      </Provider>
    </MemoryRouter>
  );
};

describe('The GRT Review page', () => {
  it('shows open status', async () => {
    const intake = {
      ...initialSystemIntakeForm,
      status: 'INTAKE_SUBMITTED'
    };
    const component: ReactWrapper = renderComponent(intake);
    expect(component!.find('[data-testid="grt-status"]').text()).toEqual(
      'Open'
    );
  });

  it('shows closed status', async () => {
    const intake = {
      ...initialSystemIntakeForm,
      status: 'LCID_ISSUED'
    };
    const component: ReactWrapper = renderComponent(intake);
    expect(component!.find('[data-testid="grt-status"]').text()).toEqual(
      'Closed'
    );
  });

  it('shows lifecycle id if it exists', async () => {
    const intake = {
      ...initialSystemIntakeForm,
      lcid: '12345'
    };
    const component: ReactWrapper = renderComponent(intake);
    expect(component.find('[data-testid="grt-lcid"]').text()).toEqual('12345');
  });
});
