import React from 'react';
import renderer from 'react-test-renderer';
import { render } from 'enzyme';

import TestingTemplates from './index';

describe('TestingTemplates', () => {
  it('renders without crashing', () => {
    const component = render(<TestingTemplates />);
    expect(component.length).toBe(1);
  });

  it('matches the snapshot', () => {
    const tree = renderer.create(<TestingTemplates />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
