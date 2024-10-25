import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import TextField from './index';

describe('The Text Field component', () => {
  const requiredProps = {
    id: 'DemoTest',
    'data-testid': 'DemoTest',
    name: 'Demo Input',
    onChange: () => {},
    onBlur: () => {},
    value: ''
  };

  it('renders without crashing', () => {
    render(<TextField {...requiredProps} />);
  });

  it('triggers onChange', () => {
    const mock = vi.fn();
    render(<TextField {...requiredProps} onChange={mock} />);
    fireEvent.change(screen.getByTestId('DemoTest'), {
      target: { value: 'Hello' }
    });

    expect(mock).toHaveBeenCalled();
  });
});
