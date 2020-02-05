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
});
