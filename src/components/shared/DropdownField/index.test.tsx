import React from 'react';
import { shallow } from 'enzyme';

import { DropdownField, DropdownItem } from './index';

describe('The Dropdown Field component', () => {
  it('renders without crashing', () => {
    shallow(
      <DropdownField
        id="TestDropdown"
        value="Value Group"
        name="testDropdown"
        onBlur={() => {}}
        onChange={() => {}}
      >
        <DropdownItem name="Value 1" value="Value1" />
        <DropdownItem name="Value 2" value="Value2" />
      </DropdownField>
    );
  });
});

describe('The Dropdown Item component', () => {
  it('renders without crashing', () => {
    shallow(<DropdownItem name="Value 1" value="Value1" />);
  });
});
