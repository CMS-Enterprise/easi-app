import React from 'react';
import { mount, shallow } from 'enzyme';
import { DateTime } from 'luxon';

import ViewTestDate from 'components/ViewTestDate/index';

describe('The View Test Date component', () => {
  it('renders without crashing', () => {
    shallow(
      <ViewTestDate date={DateTime.local()} type="INITIAL" testIndex={1} />
    );
  });

  it('renders score', () => {
    const component = mount(
      <ViewTestDate
        date={DateTime.local()}
        type="INITIAL"
        testIndex={1}
        score="100.0%"
      />
    );
    expect(component.find('[data-testid="score"]').text()).toEqual('100.0%');
  });
});
