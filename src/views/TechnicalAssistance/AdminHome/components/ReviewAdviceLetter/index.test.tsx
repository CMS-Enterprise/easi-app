import React from 'react';
import { render } from '@testing-library/react';

import { adviceLetter } from 'data/mock/trbRequest';

import ReviewAdviceLetter from '.';

describe('TRB Advice Letter review component', () => {
  it('Matches the snapshot', async () => {
    const { getByText, asFragment } = render(
      <ReviewAdviceLetter adviceLetter={adviceLetter} />
    );

    // Advice letter renders
    expect(getByText('Meeting summary text')).toBeInTheDocument();

    // Recommendation letter renders
    expect(getByText('Recommendation 1')).toBeInTheDocument();

    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
