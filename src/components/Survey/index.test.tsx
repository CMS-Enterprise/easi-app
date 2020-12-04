import React from 'react';
import { shallow } from 'enzyme';

import Survey, { SurveyTypeEnum } from './index';

describe('The Survey component', () => {
  it('renders without crashing', () => {
    shallow(<Survey surveyType={SurveyTypeEnum.ANYTHING_WRONG} />);
    shallow(<Survey surveyType={SurveyTypeEnum.IMPROVE_EASI} />);
  });
});
