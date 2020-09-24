import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import PrepareForGRB from './index';

describe('The PrepareForGRB component', () => {
  it('renders without crashing', () => {
    const mockStore = configureMockStore();
    const store = mockStore({});
    shallow(
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Provider store={store}>
          <PrepareForGRB />
        </Provider>
      </MemoryRouter>
    );
  });
});
