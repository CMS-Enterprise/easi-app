import React from 'react';
import { shallow } from 'enzyme';

import LinkCard from './index';

describe('LinkCard', () => {
  const wrapper = shallow(<LinkCard type="trb" />);
  it('renders without crashing', () => {
    expect(wrapper.length).toEqual(1);
  });
  it('renders heading with link', () => {
    expect(
      wrapper.find('h3').children().contains('Technical assistance')
    ).toEqual(true);
    expect(wrapper.find('UswdsReactLink').prop('to')).toEqual('/trb');
  });
});
