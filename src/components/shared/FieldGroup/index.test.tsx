import React from 'react';
import { render, screen } from '@testing-library/react';

import FieldGroup from './index';

describe('The FieldGroup component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<FieldGroup>Test</FieldGroup>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the correct classes', () => {
    render(
      <FieldGroup error data-testid="field-group">
        <div />
      </FieldGroup>
    );
    expect(screen.getByTestId('field-group')).toHaveClass(
      'usa-form-group--error'
    );
  });
});
