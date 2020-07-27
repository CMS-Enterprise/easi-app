import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { createMemoryHistory, createLocation } from 'history';
import { Provider } from 'react-redux';
import { match } from 'react-router-dom';
import { GrtSystemIntakeReview, SystemIDRouterProps } from './index';

describe('The GRT Review view', () => {
  it('renders without crashing', () => {
    const fakeID = 'FAKE-UUID-00001222';
    const mockStore = configureMockStore();
    const store = mockStore({
      systemIntake: {
        id: fakeID,
        requester: 'Requester',
        process_status: 'Just an idea'
      }
    });

    const mockMatch: match<SystemIDRouterProps> = {
      isExact: false,
      path: '',
      url: '',
      params: { systemID: fakeID }
    };

    const mockHistory = createMemoryHistory();
    const mockLocation = createLocation(mockMatch.url);

    shallow(
      <Provider store={store}>
        <GrtSystemIntakeReview
          match={mockMatch}
          history={mockHistory}
          location={mockLocation}
          auth={null}
        />
      </Provider>
    );
  });
});
