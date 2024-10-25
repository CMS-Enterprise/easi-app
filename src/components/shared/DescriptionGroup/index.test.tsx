import React from 'react';
import { render } from '@testing-library/react';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from './index';

describe('The Description List component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <DescriptionList title="Test Title">
        <dt>Name</dt>
        <dd>EASi</dd>
      </DescriptionList>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('The Description Term component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<DescriptionTerm term="Test Term" />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('The Description Definition component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <DescriptionDefinition definition="Test Definition" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
