import React from 'react';
import { render } from '@testing-library/react';

import Tag from './index';

describe('Tag component', () => {
  it('renders without errors', () => {
    const { queryByTestId } = render(<Tag>My Tag</Tag>);
    expect(queryByTestId('tag')).toBeInTheDocument();
  });

  describe('with a className prop', () => {
    it('applies the className', () => {
      const customClass = 'custom-class';
      const { getByTestId } = render(<Tag className={customClass}>My Tag</Tag>);
      expect(getByTestId('tag')).toHaveClass(`${customClass}`);
    });
  });
});
