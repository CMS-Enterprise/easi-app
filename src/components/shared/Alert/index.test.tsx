import React from 'react';
import { shallow } from 'enzyme';

import Alert from './index';

describe('The Alert component', () => {
  it('renders without crashing', () => {
    shallow(<Alert type="success" />);
  });

  it('renders a heading', () => {
    const component = shallow(<Alert type="success" heading="Hello" />);

    expect(component.find('h3').exists()).toEqual(true);
    expect(component.find('h3').text()).toEqual('Hello');
  });

  it('renders children', () => {
    const component = shallow(<Alert type="success">Hello</Alert>);

    expect(component.find('p').exists()).toEqual(true);
    expect(component.find('p').text()).toEqual('Hello');
  });
});
