import React from 'react';
import { mount, shallow } from 'enzyme';

import UpcomingActions from './index';

describe('The Action Banner component', () => {
  it('renders without crashing', () => {
    shallow(
      <UpcomingActions timestamp="12/31/19 at 02:45am">
        <div />
      </UpcomingActions>
    );
  });

  it('renders header', () => {
    const component = mount(
      <UpcomingActions timestamp="12/31/19 at 02:45am">
        <div />
      </UpcomingActions>
    );
    expect(component.find('.upcoming-actions__header').length).toEqual(1);
    expect(component.find('h1').text()).toEqual('Upcoming Actions');
    expect(component.find('.timestamp').text()).toEqual(
      'as of 12/31/19 at 02:45am'
    );
  });

  it('renders children', () => {
    const component = mount(
      <UpcomingActions timestamp="12/31/19 at 02:45am">
        <button type="button">Thing</button>
        <div className="Test">blah</div>
        <div className="Test">foobar</div>
      </UpcomingActions>
    );
    expect(component.find('button').length).toEqual(1);
    expect(component.find('button').text()).toEqual('Thing');
    expect(component.find('.Test').length).toEqual(2);
  });
});
