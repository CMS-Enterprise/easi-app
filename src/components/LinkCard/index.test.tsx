import React from 'react';
import { shallow } from 'enzyme';

import LinkCard from './index';

describe('LinkCard', () => {
  const wrapper = shallow(<LinkCard type="TRB" />);
  it('renders without crashing', () => {
    expect(wrapper.length).toEqual(1);
  });
  it('renders heading with link', () => {
    expect(
      wrapper.find('h3').children().contains('Technical Assistance')
    ).toEqual(true);
    expect(wrapper.find('UswdsReactLink').prop('to')).toEqual('/trb');
  });
});
