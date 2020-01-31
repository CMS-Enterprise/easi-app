import React from 'react';
import { shallow } from 'enzyme';
import TextboxField from './index';

describe('The Textbox Field component', () => {
  it('renders without crashing', () => {
    shallow(
      <TextboxField
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
