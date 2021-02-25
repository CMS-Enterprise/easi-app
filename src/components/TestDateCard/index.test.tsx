import React from 'react';
import { mount, shallow } from 'enzyme';
import { DateTime } from 'luxon';

import TestDateCard from 'components/TestDateCard';

describe('The Test Date Card component', () => {
  it('renders without crashing', () => {
    shallow(
      <TestDateCard
        date={DateTime.local().toISO()}
        type="INITIAL"
        testIndex={1}
        score={0}
      />
    );
  });

  it('renders score', () => {
    const component = mount(
      <TestDateCard
        date={DateTime.local().toISO()}
        type="INITIAL"
        testIndex={1}
        score={1000}
      />
    );
    expect(component.find('[data-testid="score"]').text()).toEqual('100.0%');
  });
});
