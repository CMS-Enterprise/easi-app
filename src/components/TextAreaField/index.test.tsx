import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import TextAreaField from './index';

describe('The Text Area Field component', () => {
  const requiredProps = {
    id: 'DemoTest',
    'data-testid': 'DemoTest',
    name: 'Demo TextArea',
    onChange: () => {},
    onBlur: () => {},
    value: ''
  };

  it('matches snapshot', () => {
    const { asFragment } = render(
      <TextAreaField {...requiredProps} label="Demo Label" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('triggers onChange', () => {
    const mock = vi.fn();
    render(<TextAreaField {...requiredProps} onChange={mock} />);
    fireEvent.change(screen.getByTestId('DemoTest'), {
      target: { value: 'Hello' }
    });

    expect(mock).toHaveBeenCalled();
  });
});
