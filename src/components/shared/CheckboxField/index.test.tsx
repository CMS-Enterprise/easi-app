import React from 'react';
import { shallow } from 'enzyme';

import CheckboxField from './index';

describe('The Checkbox Field component', () => {
  it('renders without crashing', () => {
    shallow(
      <CheckboxField
        id="TestTextbox"
        label="Test Textbox"
        name="Test"
        onChange={() => {}}
        onBlur={() => {}}
        value="Test"
      />
    );
  });

  it('has the correct value', () => {
    const fixture = 'Test';
    const component = shallow(
      <CheckboxField
        id="TestTextbox"
        label="Test Textbox"
        name="Test"
        onChange={() => {}}
        onBlur={() => {}}
        value={fixture}
      />
    );
    expect(component.find('input').props().value).toEqual(fixture);
  });
});
