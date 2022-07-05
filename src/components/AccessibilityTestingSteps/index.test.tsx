import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import AccessibilityTestingSteps from './index';

describe('Accessibility Testing Steps Overview', () => {
  it('renders default version without crashing', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AccessibilityTestingSteps />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders help section version without crashing', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AccessibilityTestingSteps helpArticle />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
