import React from 'react';
import { mount, shallow } from 'enzyme';

import Alert, { AlertText } from './index';

describe('The Alert component', () => {
  it('renders without crashing', () => {
    shallow(<Alert type="success" />);
  });

  it('renders a heading', () => {
    const component = shallow(<Alert type="success" heading="Hello" />);

    expect(component.find('h3').exists()).toEqual(true);
    expect(component.find('h3').text()).toEqual('Hello');
  });

  describe('children', () => {
    it('renders string children', () => {
      const component = mount(<Alert type="success">Hello</Alert>);

      expect(component.find('p').exists()).toEqual(true);
      expect(component.find('p').text()).toEqual('Hello');
    });
  });

  it('renders JSX children', () => {
    const component = shallow(
      <Alert type="success">
        <div data-testid="test-child">Hello</div>
      </Alert>
    );

    expect(component.find('p').exists()).toEqual(false);
    expect(component.find('[data-testid="test-child"]').text()).toEqual(
      'Hello'
    );
  });
});

describe('The AlertText component', () => {
  it('renders without crashing', () => {
    shallow(<AlertText>Hello</AlertText>);
  });

  it('renders custom class name', () => {
    const component = shallow(
      <AlertText className="test-class">Hello</AlertText>
    );

    expect(component.find('.test-class').exists()).toEqual(true);
  });

  it('renders custom HTML attributes', () => {
    const component = shallow(
      <AlertText aria-label="I am aria label">Hello</AlertText>
    );

    expect(component.props()['aria-label']).toEqual('I am aria label');
  });
});
