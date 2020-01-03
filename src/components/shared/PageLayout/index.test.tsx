import React from 'react';
import { shallow } from 'enzyme';
import PageLayout from './index';

describe('The PageLayout component', () => {
  it('renders without crashing', () => {
    shallow(<PageLayout />);
  });

  it('can receive a custom class name', () => {
    const fixture = 'test-class';
    const component = shallow(<PageLayout className={fixture} />);
    expect(component.find(`.${fixture}`).length).toEqual(1);
  });

  it('renders children', () => {
    const component = shallow(
      <PageLayout>
        <div />
      </PageLayout>
    );

    expect(component.find('div').length).toEqual(1);
  });
});
