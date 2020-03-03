import React from 'react';
import { shallow } from 'enzyme';
import CollapsableLink from './index';

describe('The Collapsable Link componnet', () => {
  it('renders without crashing', () => {
    shallow(<CollapsableLink label="testLabel">Hello!</CollapsableLink>);
  });

  it('renders label and not content when closed', () => {
    const component = shallow(
      <CollapsableLink label="Label">Test</CollapsableLink>
    );
    expect(component.text()).toEqual('Label');
  });
});
