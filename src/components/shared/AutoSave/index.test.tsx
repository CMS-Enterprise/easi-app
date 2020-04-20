import React from 'react';
import { shallow, mount } from 'enzyme';
import AutoSave from './index';

describe('The Autosave component', () => {
  it('renders without crashing', () => {
    shallow(<AutoSave values={{}} onSave={() => {}} />);
  });

  it('does not fire onSave on initial load', () => {
    const onSave = jest.fn();
    mount(<AutoSave values={{}} onSave={onSave} />);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('fires onSave when values changed', () => {
    const onSave = jest.fn();
    const component = mount(
      <AutoSave values={{ name: 'fake name' }} onSave={onSave} />
    );
    component.setProps({ name: 'another name' });
    setTimeout(() => expect(onSave).toHaveBeenCalled(), 1000);
  });
});
