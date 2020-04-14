import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { createMemoryHistory, createLocation } from 'history';
import { Provider } from 'react-redux';
import { match } from 'react-router-dom';
import { SystemProfile, SystemProfileRouterProps } from './index';

describe('The System Profile view', () => {
  it('renders without crashing', () => {
    const mockStore = configureMockStore();
    const store = mockStore({
      demoName: ''
    });

    const mockMatch: match<SystemProfileRouterProps> = {
      isExact: false,
      path: '',
      url: '',
      params: { profileId: '' }
    };

    const mockHistory = createMemoryHistory();
    const mockLocation = createLocation(mockMatch.url);

    shallow(
      <Provider store={store}>
        <SystemProfile
          match={mockMatch}
          history={mockHistory}
          location={mockLocation}
        />
      </Provider>
    );
  });
});
