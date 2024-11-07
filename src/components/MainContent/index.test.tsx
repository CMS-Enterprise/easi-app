import React from 'react';
import { render, screen } from '@testing-library/react';

import MainContent from './index';

describe('The MainContent component', () => {
  it('renders without crashing', () => {
    render(
      <MainContent>
        <div />
      </MainContent>
    );
  });

  it('renders custom class names', () => {
    const { container } = render(
      <MainContent className="test-class">
        <div />
      </MainContent>
    );

    expect(container.getElementsByClassName('test-class').length).toBe(1);
  });

  it('renders children', () => {
    render(
      <MainContent className="test-class">
        <div data-testid="test-child" />
      </MainContent>
    );

    screen.getByTestId('test-child');
  });
});
