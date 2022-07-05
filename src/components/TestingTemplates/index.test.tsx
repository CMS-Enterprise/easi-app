import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import TestingTemplates from '.';

describe('Template for 508 Testing', () => {
  it('renders without crashing', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <TestingTemplates />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders help mode without crashing', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <TestingTemplates helpArticle />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
