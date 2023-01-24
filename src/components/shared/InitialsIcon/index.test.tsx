import React from 'react';
import { render } from '@testing-library/react';

import InitialsIcon, { colorClassNames } from './index';

describe('The Initials Icon component', () => {
  it('renders the icon', () => {
    const { getByTestId } = render(
      <InitialsIcon name="Jane Marie Doe, Jr" index={3} />
    );

    /** Rendered icon */
    const icon = getByTestId('initials-icon');

    // Icon renders correct initials
    expect(icon).toHaveTextContent('JD');

    // Icon contains correct background color class
    expect(icon).toHaveClass(colorClassNames[3]);
  });
});
