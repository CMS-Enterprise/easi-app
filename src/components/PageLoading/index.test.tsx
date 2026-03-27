import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

import PageLoading from './index';

describe('PageLoading', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders inline without errors', () => {
    render(<PageLoading />);
    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
  });

  it('renders fullScreen into document.body and locks body scroll while mounted', () => {
    const prevOverflow = document.body.style.overflow;
    const { unmount } = render(<PageLoading fullScreen />);

    const el = screen.getByTestId('page-loading');
    expect(el).toBeInTheDocument();
    // should be appended to document.body when portal is used
    expect(document.body).toContainElement(el);
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe(prevOverflow);
  });
});
