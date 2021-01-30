import React from 'react';
import { mount, shallow } from 'enzyme';

import TestDates from './index';

describe('The Test Dates component', () => {
  it('renders without crashing', () => {
    shallow(<TestDates date="January 1, 2021" isInitial testIndex={1} />);
  });

  it('renders score', () => {
    const component = mount(
      <TestDates
        date="January 1, 2021"
        isInitial
        testIndex={1}
        score="100.0%"
      />
    );
    expect(component.find('[data-testid="score"]').text()).toEqual('100.0%');
  });
});
