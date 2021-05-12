import React from 'react';
import { shallow } from 'enzyme';

import Label from './index';

describe('The Link component', () => {
  it('renders without crashing', () => {
    shallow(<Label htmlFor="test">Test</Label>);
  });

  it('displays children (text)', () => {
    const component = shallow(<Label htmlFor="test">Test</Label>);

    expect(component.find('label').text()).toEqual('Test');
  });

  it('displays children (HTML)', () => {
    const component = shallow(
      <Label htmlFor="test">
        <div data-testid="label-child">Hi</div>
      </Label>
    );

    expect(component.find('[data-testid="label-child"]').exists()).toEqual(
      true
    );
  });

  it('renders an aria-label', () => {
    const component = shallow(
      <Label htmlFor="test" aria-label="aria test">
        Test
      </Label>
    );

    expect(component.find('label').prop('aria-label')).toEqual('aria test');
  });
});
