import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import RequestTypeForm from './index';

describe('The request type form page', () => {
  it('renders without crashing', () => {
    const mockStore = configureMockStore();
    const store = mockStore();
    shallow(
      <Provider store={store}>
        <RequestTypeForm />
      </Provider>
    );
  });
});
