import React from 'react';
import { shallow } from 'enzyme';
import { DropdownField, DropdownItem } from './index';

describe('The Dropdown Field component', () => {
  it('renders without crashing', () => {
    shallow(
      <DropdownField id="TestDropdown">
        <DropdownItem value="Value1">Value 1</DropdownItem>
        <DropdownItem value="Value2">Value 2</DropdownItem>
      </DropdownField>
    );
  });

  it('displays a label', () => {
    const fixture = 'Values';
    const component = shallow(
      <DropdownField id="TestDropdown" label={fixture}>
        <DropdownItem value="Value1">Value 1</DropdownItem>
        <DropdownItem value="Value2">Value 2</DropdownItem>
      </DropdownField>
    );
    expect(component.find('label').text()).toStrictEqual(fixture);
  });
});

describe('The Dropdown Item component', () => {
  it('renders without crashing', () => {
    shallow(<DropdownItem value="Value1">Value 1</DropdownItem>);
  });
});
