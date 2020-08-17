import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

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
