import React from 'react';
import { shallow } from 'enzyme';

import AccessibilityRequestsTable from './index';

describe('AccessibilityRequestsTable', () => {
  const wrapper = shallow(<AccessibilityRequestsTable requests={[]} />);
  it('renders without crashing', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('contains all the expected columns', () => {
    expect(wrapper.find('th').at(0).contains('Request Name')).toBe(true);
    expect(wrapper.find('th').at(1).contains('Submission Date')).toBe(true);
    expect(wrapper.find('th').at(2).contains('Business Owner')).toBe(true);
    expect(wrapper.find('th').at(3).contains('Test Date')).toBe(true);
    expect(wrapper.find('th').at(4).contains('Status')).toBe(true);
  });
});
