import React from 'react';
import { shallow } from 'enzyme';

import FieldErrorMsg from './index';

describe('The FieldErrorMsg componnet', () => {
  it('renders without crashing', () => {
    shallow(<FieldErrorMsg>Error</FieldErrorMsg>);
  });

  it('can render nothing', () => {
    const component = shallow(<FieldErrorMsg />);

    expect(component.type()).toEqual(null);
  });

  it('renders a message', () => {
    const component = shallow(
      <FieldErrorMsg>
        <span id="testtest" />
      </FieldErrorMsg>
    );

    expect(component.find('#testtest').exists()).toBe(true);
  });
});
