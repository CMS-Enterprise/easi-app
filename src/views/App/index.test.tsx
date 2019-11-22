import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import App from './index';

it('renders without crashing', () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    demoName: ''
  });
  shallow(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
