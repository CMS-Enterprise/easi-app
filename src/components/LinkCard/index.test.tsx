import React from 'react';
import { shallow } from 'enzyme';

import LinkCard from './index';

describe('LinkCard', () => {
  const props = {
    link: 'https://test/page',
    heading: 'I am your header'
  };

  const wrapper = shallow(
    <LinkCard {...props}>
      <div>Component, I am your child</div>
    </LinkCard>
  );
  it('renders without crashing', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('renders heading with link', () => {
    expect(wrapper.find('h2').children().contains(props.heading)).toEqual(true);
    expect(wrapper.find('UswdsReactLink').prop('to')).toEqual(props.link);
  });
});
