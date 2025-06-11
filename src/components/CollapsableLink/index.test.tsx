import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CollapsableLink from './index';

describe('The Collapsable Link componnet', () => {
  it('renders without crashing', () => {
    const { asFragment } = render(
      <CollapsableLink id="Test" label="testLabel">
        Hello!
      </CollapsableLink>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders children content when expanded', async () => {
    render(
      <CollapsableLink id="Test" label="Test">
        <div data-testid="children" />
      </CollapsableLink>
    );

    userEvent.click(screen.getByTestId('collapsable-link'));
    await screen.findByTestId('children');

    expect(screen.getByRole('button', { name: 'Test' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });
});
