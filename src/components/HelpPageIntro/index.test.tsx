import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import HelpPageIntro from './index';

describe('HelpPageIntro', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <HelpPageIntro
          heading="Page Heading"
          subheading="This is the intro content that describes the page"
          type="IT Governance"
        />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
