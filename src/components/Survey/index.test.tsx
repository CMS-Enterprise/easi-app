import React from 'react';
import { shallow } from 'enzyme';

import { AnythingWrongSurvey, ImproveEasiSurvey } from './index';

describe('The Survey component', () => {
  it('renders without crashing', () => {
    shallow(<AnythingWrongSurvey />);
    shallow(<ImproveEasiSurvey />);
  });
});
