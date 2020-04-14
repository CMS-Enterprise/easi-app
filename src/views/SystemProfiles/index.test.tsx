import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { SystemProfiles } from './index';

describe('The System Profile view', () => {
  it('renders without crashing', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      demoName: ''
    });

    shallow(
      <Provider store={store}>
        <SystemProfiles />
      </Provider>
    );
  });
});
