import React from 'react';
import { shallow } from 'enzyme';

import MainContent from './index';

describe('The MainContent component', () => {
  it('renders without crashing', () => {
    shallow(
      <MainContent>
        <div />
      </MainContent>
    );
  });

  it('renders custom class names', () => {
    const component = shallow(
      <MainContent className="test-class">
        <div />
      </MainContent>
    );

    expect(component.find('main.test-class').exists()).toEqual(true);
  });

  it('renders children', () => {
    const component = shallow(
      <MainContent>
        <div data-testid="test-child" />
      </MainContent>
    );

    expect(component.find('[data-testid="test-child"]').exists()).toEqual(true);
  });
});
