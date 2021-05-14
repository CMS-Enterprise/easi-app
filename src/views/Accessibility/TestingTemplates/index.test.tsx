import React from 'react';
import { render } from 'enzyme';

import TestingTemplates from './index';

describe('TestingTemplates', () => {
  it('renders without crashing', () => {
    const component = render(<TestingTemplates />);
    expect(component.length).toBe(1);
  });
});
