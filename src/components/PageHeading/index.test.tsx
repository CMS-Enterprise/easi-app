import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import PageHeading from './index';

describe('Page heading component', () => {
  it('renders without errors', () => {
    shallow(<PageHeading>Test Heading</PageHeading>);
  });

  it('matches the snapshot', () => {
    const tree = renderer
      .create(<PageHeading>Test Heading</PageHeading>)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
