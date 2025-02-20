import React from 'react';
import { render } from '@testing-library/react';

import SectionWrapper from './index';

describe('SectionWrapper', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(<SectionWrapper />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with a border', () => {
    const { getByTestId } = render(<SectionWrapper border />);

    expect(getByTestId('section-wrapper')).toHaveClass('easi-section__border');
  });

  it('renders with a bottom border', () => {
    const { getByTestId } = render(<SectionWrapper borderBottom />);

    expect(getByTestId('section-wrapper')).toHaveClass(
      'easi-section__border-bottom'
    );
  });

  it('renders with a top border', () => {
    const { getByTestId } = render(<SectionWrapper borderTop />);

    expect(getByTestId('section-wrapper')).toHaveClass(
      'easi-section__border-top'
    );
  });
});
