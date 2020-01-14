import React from 'react';
import { shallow, mount } from 'enzyme';
import SearchBar from './index';

describe('The Search Bar component', () => {
  it('renders without crashing', () => {
    shallow(<SearchBar name="test-name" onSearch={() => {}} />);
  });

  it('accepts a name attribute', () => {
    const fixture = 'test-name-attr';
    const component = shallow(<SearchBar name={fixture} onSearch={() => {}} />);
    expect(component.find(`input[name="${fixture}"]`).length).toEqual(1);
  });

  it('triggers on onChange action', () => {
    const fixture = jest.fn();
    const event = {
      target: {
        value: 'EASi'
      }
    };

    const component = mount(
      <SearchBar name="test-name-attr" onSearch={fixture} />
    );
    component.find('.usa-input').simulate('change', event);
    expect(fixture).toHaveBeenCalled();
  });
});
