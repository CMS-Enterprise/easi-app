import React from 'react';
import { render } from '@testing-library/react';

import Spinner from './index';

describe('Spinner', () => {
  it('renders without errors', () => {
    const { getByTestId } = render(<Spinner data-testid="spinner" />);

    expect(getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders a small spinner', () => {
    const { getByTestId } = render(
      <Spinner size="small" data-testid="spinner" />
    );

    expect(getByTestId('spinner')).toHaveClass('easi-spinner--small');
  });

  it('renders a large spinner', () => {
    const { getByTestId } = render(
      <Spinner size="large" data-testid="spinner" />
    );

    expect(getByTestId('spinner')).toHaveClass('easi-spinner--large');
  });

  it('renders a xl spinner', () => {
    const { getByTestId } = render(<Spinner size="xl" data-testid="spinner" />);

    expect(getByTestId('spinner')).toHaveClass('easi-spinner--xl');
  });
});
