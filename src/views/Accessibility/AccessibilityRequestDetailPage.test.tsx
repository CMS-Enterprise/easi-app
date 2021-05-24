import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';

import { MessageProvider } from 'hooks/useMessage';

import AccessibilityRequestDetailPage from './AccessibilityRequestDetailPage';

describe('AccessibilityRequestDetailPage', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <MemoryRouter>
        <MessageProvider>
          <AccessibilityRequestDetailPage />
        </MessageProvider>
      </MemoryRouter>
    );
    expect(wrapper.length).toEqual(1);
  });
});
