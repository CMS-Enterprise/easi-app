import React from 'react';
import { shallow } from 'enzyme';
import ActionLink from './index';

const renderComponent = (label: string, href: string, target?: string) => {
  if (target) {
    return shallow(<ActionLink label={label} href={href} target={target} />);
  }
  return shallow(<ActionLink label={label} href={href} />);
};

describe('The ActionLink component', () => {
  it('renders without crashing', () => {
    expect(renderComponent).not.toThrow();
  });

  it('renders the label', () => {
    const component = renderComponent('Test Label', '/');

    expect(
      component
        .find('div')
        .children()
        .text()
    ).toEqual('Test Label');
  });

  it('includes the href', () => {
    const component = renderComponent('label', '/some-url');
    expect(
      component
        .find('div')
        .children()
        .prop('href')
    ).toEqual('/some-url');
  });

  it('includes a target if one is included', () => {
    const component = renderComponent('label', '/', '_blank');
    expect(
      component
        .find('div')
        .children()
        .prop('target')
    ).toEqual('_blank');
  });
});
