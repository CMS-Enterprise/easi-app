import React from 'react';
import { render } from '@testing-library/react';

import BookmarkCardIcon from './index';

describe('BookmarkCardIcon', () => {
  it('renders without errors', () => {
    const { getByTestId } = render(<BookmarkCardIcon size="lg" />);

    expect(getByTestId('bookmark-icon')).toBeInTheDocument();
  });

  it('renders a small icon', () => {
    const { getByTestId } = render(<BookmarkCardIcon size="sm" />);

    expect(getByTestId('bookmark-icon')).toHaveClass('fa-1x');
  });

  it('renders a small icon', () => {
    const { getByTestId } = render(<BookmarkCardIcon size="md" />);

    expect(getByTestId('bookmark-icon')).toHaveClass('fa-2x');
  });

  it('renders a small icon', () => {
    const { getByTestId } = render(<BookmarkCardIcon size="lg" />);

    expect(getByTestId('bookmark-icon')).toHaveClass('fa-3x');
  });
});
