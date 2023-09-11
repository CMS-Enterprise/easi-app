import React from 'react';
import { mount, shallow } from 'enzyme';

import AutoSave from './index';

describe('The Autosave component', () => {
  it('renders without crashing', () => {
    shallow(<AutoSave values={{}} onSave={() => {}} debounceDelay={0} />);
  });

  it('does not fire onSave on initial load', () => {
    const onSave = vi.fn();
    mount(<AutoSave values={{}} onSave={onSave} debounceDelay={0} />);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('fires onSave when values changed', () => {
    const onSave = vi.fn();
    const component = mount(
      <AutoSave
        values={{ name: 'fake name' }}
        onSave={onSave}
        debounceDelay={1000}
      />
    );
    component.setProps({ name: 'another name' });
    setTimeout(() => expect(onSave).toHaveBeenCalled(), 1000);
  });
});
