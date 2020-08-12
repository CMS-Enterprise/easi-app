import React from 'react';
import { shallow } from 'enzyme';

import { UserAction, UserActionList } from './index';

describe('The UserActionLst component', () => {
  it('renders without crashing', () => {
    shallow(
      <UserActionList>
        <UserAction>Hello</UserAction>
        <UserAction>Goodbye</UserAction>
      </UserActionList>
    );
  });
});

describe('The UserAction component', () => {
  it('executes onClick when clicked', () => {
    const fixture = jest.fn();
    const component = shallow(<UserAction onClick={fixture}>Hello</UserAction>);

    component.find('button').simulate('click');
    expect(fixture).toBeCalledTimes(1);
  });

  it('executes onClick when clicked', () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000'
      }
    });
    const component = shallow(<UserAction link="/test">Hello</UserAction>);

    component.find('button').simulate('click');
    expect(window.location.href).toEqual('/test');
  });
});
