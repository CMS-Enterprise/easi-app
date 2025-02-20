import React from 'react';
import { render } from '@testing-library/react';

import CheckboxField from './index';

describe('The Checkbox Field component', () => {
  it('renders without crashing', () => {
    const { asFragment } = render(
      <CheckboxField
        id="TestTextbox"
        label="Test Textbox"
        name="Test"
        onChange={() => {}}
        onBlur={() => {}}
        value="Test"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
