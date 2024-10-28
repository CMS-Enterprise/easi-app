import React from 'react';
import { render } from '@testing-library/react';

import MandatoryFieldsAlert from './index';

describe('The Mandatory Fields Alert component', () => {
  it('renders without crashing', () => {
    render(<MandatoryFieldsAlert />);
  });
});
