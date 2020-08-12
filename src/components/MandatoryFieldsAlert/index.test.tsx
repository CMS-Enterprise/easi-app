import React from 'react';
import { shallow } from 'enzyme';

import MandatoryFieldsAlert from './index';

describe('The Mandatory Fields Alert component', () => {
  it('renders without crashing', () => {
    shallow(<MandatoryFieldsAlert />);
  });
});
