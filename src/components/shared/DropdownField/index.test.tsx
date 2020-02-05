import React from 'react';
import { shallow } from 'enzyme';
import { DropdownField, DropdownItem } from './index';

describe('The Dropdown Field component', () => {
  it('renders without crashing', () => {
    shallow(
      <DropdownField id="TestDropdown">
        <DropdownItem name="Value 1" value="Value1" />
        <DropdownItem name="Value 2" value="Value2" />
      </DropdownField>
    );
  });

  it('displays a label', () => {
    const fixture = 'Values';
    const component = shallow(
      <DropdownField id="TestDropdown" label={fixture}>
        <DropdownItem name="Value 1" value="Value1" />
        <DropdownItem name="Value 2" value="Value2" />
      </DropdownField>
    );
    expect(component.find('label').text()).toStrictEqual(fixture);
  });
});

describe('The Dropdown Item component', () => {
  it('renders without crashing', () => {
    shallow(<DropdownItem name="Value 1" value="Value1" />);
  });
});
