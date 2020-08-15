import React from 'react';
import { shallow } from 'enzyme';

import UsGovBanner from './index';

describe('The US Governemnt Banner', () => {
  it('renders without crashing', () => {
    shallow(<UsGovBanner />);
  });
});
