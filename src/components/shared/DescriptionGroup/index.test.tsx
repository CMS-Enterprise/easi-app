import React from 'react';
import { shallow } from 'enzyme';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from './index';

describe('The Description List component', () => {
  const component = shallow(
    <DescriptionList title="Test Title">
      <dt>Name</dt>
      <dd>EASi</dd>
    </DescriptionList>
  );

  it('renders without crashing', () => {
    shallow(
      <DescriptionList title="">
        <dt>Name</dt>
        <dd>EASi</dd>
      </DescriptionList>
    );
  });

  it('has the correct title for the list', () => {
    expect(component.find('dl').props().title).toEqual('Test Title');
  });

  it('renders children', () => {
    expect(component.find('dt').exists()).toEqual(true);
    expect(component.find('dd').exists()).toEqual(true);
  });
});

describe('The Description Term component', () => {
  it('renders without crashing', () => {
    shallow(<DescriptionTerm term="" />);
  });

  it('renders the term', () => {
    const component = shallow(<DescriptionTerm term="Test Term" />);

    expect(component.find('dt').text()).toEqual('Test Term');
  });
});

describe('The Description Definition component', () => {
  it('renders without crashing', () => {
    shallow(<DescriptionDefinition definition="" />);
  });

  it('renders the definition', () => {
    const component = shallow(
      <DescriptionDefinition definition="Test Definition" />
    );

    expect(component.find('dd').text()).toEqual('Test Definition');
  });
});
