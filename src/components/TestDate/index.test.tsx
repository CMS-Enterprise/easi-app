import React from 'react';
import { mount, shallow } from 'enzyme';
import { DateTime } from 'luxon';

import TestDate from 'components/TestDate/index';

describe('The Test Date component', () => {
  it('renders without crashing', () => {
    shallow(<TestDate date={DateTime.local()} type="INITIAL" testIndex={1} />);
  });

  it('renders score', () => {
    const component = mount(
      <TestDate
        date={DateTime.local()}
        type="INITIAL"
        testIndex={1}
        score="100.0%"
      />
    );
    expect(component.find('[data-testid="score"]').text()).toEqual('100.0%');
  });
});
