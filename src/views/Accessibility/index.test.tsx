import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import Accessibility from './index';

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

describe('Accessibility wrapper', () => {
  const mockStore = configureMockStore();
  const store = mockStore({ auth: { groups: [], isUserSet: true } });
  it('renders without crashing', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <Accessibility />
      </Provider>
    );
    expect(wrapper.length).toBe(1);
  });

  it('renders the "Report a problem" link area component', async () => {
    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <Provider store={store}>
            <Accessibility />
          </Provider>
        </MemoryRouter>
      );
      wrapper.update();
    });
    expect(wrapper.find('ReportProblemLinkArea').exists()).toBe(true);
  });

  it('uses the right href value for the report problem link for a 508 tester or user', async () => {
    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <Provider store={store}>
            <Accessibility />
          </Provider>
        </MemoryRouter>
      );
      wrapper.update();
    });
    expect(
      wrapper.find('ReportProblemLinkArea').find('a').props().href
    ).toEqual('https://www.surveymonkey.com/r/GCYMVY8');
  });
});
