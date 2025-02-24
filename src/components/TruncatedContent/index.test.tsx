import React from 'react';
import { render } from '@testing-library/react';

import TruncatedContent from './index';

describe('CedarContactSelect', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <ul>
        <TruncatedContent initialCount={2}>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
          <li>Four</li>
          <li>Five</li>
        </TruncatedContent>
      </ul>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
