import React from 'react';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import Button from './index';

describe('The button component', () => {
  it('renders without crashing', () => {
    shallow(<Button>Test</Button>);
  });

  it('renders children', () => {
    const component = shallow(
      <Button type="button" onClick={() => {}}>
        <div data-test="testid" />
      </Button>
    );
    expect(component.find("[data-test='testid']").exists()).toEqual(true);
  });

  it('renders class names', () => {
    const component = shallow(
      <Button type="button" onClick={() => {}} outline>
        Test
      </Button>
    );
    expect(component.find('.usa-button--outline').exists()).toEqual(true);
  });

  it('renders <button> by default', () => {
    const component = shallow(<Button type="button">Test</Button>);
    expect(component.find('button').exists()).toEqual(true);
    expect(component.find('button').prop('type')).toEqual('button');
  });

  it('renders a custom string HTML element with props', () => {
    const component = shallow(
      <Button
        component="a"
        href="https://www.cms.gov"
        target="__blank"
        rel="noopener noreferrer"
      >
        Visit CMS
      </Button>
    );

    expect(component.find('a').exists()).toEqual(true);
    expect(component.find('a').prop('href')).toEqual('https://www.cms.gov');
    expect(component.find('a').prop('target')).toEqual('__blank');
    expect(component.find('a').prop('rel')).toEqual('noopener noreferrer');
  });

  it('renders custom component with props', () => {
    const component = shallow(
      <Button component={Link} to="/login" data-testid="test">
        Test
      </Button>
    );

    expect(component.find(Link).exists()).toEqual(true);
    expect(component.find(Link).prop('data-testid')).toEqual('test');
  });
});
