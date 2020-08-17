import React from 'react';
import { shallow } from 'enzyme';

import { RadioField } from './index';

describe('The Radio Field', () => {
  it('renders without crashing', () => {
    shallow(
      <RadioField
        id="TestRadio"
        label="A"
        name="Question1"
        onBlur={() => {}}
        onChange={() => {}}
        value="A"
      />
    );
  });

  it('has the correct value', () => {
    const fixture = 'A';
    const component = shallow(
      <RadioField
        id="TestRadio"
        label="A"
        name="Question1"
        onBlur={() => {}}
        onChange={() => {}}
        value={fixture}
      />
    );

    expect(component.find('input').props().value).toEqual(fixture);
  });
});
