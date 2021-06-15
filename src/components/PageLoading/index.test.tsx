import React from 'react';
import { render } from '@testing-library/react';

import PageLoading from './index';

describe('PageLoading', () => {
  it('renders without errors', () => {
    const { getByTestId } = render(<PageLoading />);

    expect(getByTestId('page-loading')).toBeInTheDocument();
  });
});
