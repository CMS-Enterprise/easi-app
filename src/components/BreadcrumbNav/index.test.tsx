import React from 'react';
import { shallow } from 'enzyme';

import BreadcrumbNav from './index';

describe('The BreadcrumbNav component', () => {
  it('renders without crashing', () => {
    shallow(
      <BreadcrumbNav>
        <li />
      </BreadcrumbNav>
    );
  });

  it('renders children', () => {
    const component = shallow(
      <BreadcrumbNav>
        <li data-testid="test-list-item" />
      </BreadcrumbNav>
    );

    expect(component.find('[data-testid="test-list-item"]').exists()).toEqual(
      true
    );
  });
});
