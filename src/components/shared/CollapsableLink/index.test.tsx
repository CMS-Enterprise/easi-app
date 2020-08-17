import React from 'react';
import { Button } from '@trussworks/react-uswds';
import { shallow } from 'enzyme';

import CollapsableLink from './index';

describe('The Collapsable Link componnet', () => {
  it('renders without crashing', () => {
    shallow(
      <CollapsableLink id="Test" label="testLabel">
        Hello!
      </CollapsableLink>
    );
  });

  it('hides content by children', () => {
    const component = shallow(
      <CollapsableLink id="Test" label="Test">
        <div data-testid="children" />
      </CollapsableLink>
    );

    expect(component.find('[data-testid="children"]').exists()).toEqual(false);
    expect(component.find(Button).prop('aria-expanded')).toEqual(false);
  });

  it('renders children content when expanded', () => {
    const component = shallow(
      <CollapsableLink id="Test" label="Test">
        <div data-testid="children" />
      </CollapsableLink>
    );

    component.find(Button).simulate('click');

    expect(component.find('[data-testid="children"]').exists()).toEqual(true);
    expect(component.find(Button).prop('aria-expanded')).toEqual(true);
  });
});
