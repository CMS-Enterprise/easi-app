import React from 'react';
import { shallow } from 'enzyme';

import LinkCard from './index';

describe('LinkCard', () => {
  it('renders without crashing', () => {
    const props = {
      link: 'https://test/page',
      heading: 'I am your header'
    };

    shallow(
      <LinkCard {...props}>
        <div>Component, I am your child</div>
      </LinkCard>
    );
  });
});
