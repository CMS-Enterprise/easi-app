import React from 'react';
import { shallow } from 'enzyme';

import AccessibilityRequestNextStep from './index';

describe('AccessibilityRequestNextStep', () => {
  const wrapper = shallow(<AccessibilityRequestNextStep />);
  it('renders without error', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('has expected contents', () => {
    expect(
      wrapper.find('h2').contains('Next step: Provide your documents')
    ).toEqual(true);
  });
});
