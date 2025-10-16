import React from 'react';
import { render, screen } from '@testing-library/react';

import PercentCompleteTag from '.';

describe('PercentCompleteTag', () => {
  it('renders with percent less than 20', () => {
    render(<PercentCompleteTag percentComplete={19} />);

    expect(screen.getByText('19% complete')).toBeInTheDocument();

    expect(screen.getByText('19% complete')).toHaveClass('bg-error-dark');
  });

  it('renders with percent between 20 and 80', () => {
    render(<PercentCompleteTag percentComplete={21} />);

    expect(screen.getByText('21% complete')).toBeInTheDocument();

    expect(screen.getByText('21% complete')).toHaveClass('bg-warning');
    expect(screen.getByText('21% complete')).toHaveClass('text-base-darkest');
  });

  it('renders with percent greater than 80', () => {
    render(<PercentCompleteTag percentComplete={81} />);

    expect(screen.getByText('81% complete')).toBeInTheDocument();

    expect(screen.getByText('81% complete')).toHaveClass('bg-success-dark');
  });

  it('converts decimal numbers to integers', () => {
    render(<PercentCompleteTag percentComplete={81.6} />);

    expect(screen.getByText('82% complete')).toBeInTheDocument();
  });

  it('converts negative numbers to 0', () => {
    render(<PercentCompleteTag percentComplete={-1} />);

    expect(screen.getByText('0% complete')).toBeInTheDocument();
  });

  it('converts numbers greater than 100 to 100', () => {
    render(<PercentCompleteTag percentComplete={101} />);

    expect(screen.getByText('100% complete')).toBeInTheDocument();
  });
});
