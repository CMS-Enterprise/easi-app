import React from 'react';
import { render } from '@testing-library/react';

import { adviceLetter } from 'data/mock/trbRequest';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ReviewAdviceLetter from '.';

describe('TRB Advice Letter review component', () => {
  it('Matches the snapshot', async () => {
    const { getByText, asFragment } = render(
      <VerboseMockedProvider>
        <ReviewAdviceLetter
          adviceLetter={adviceLetter}
          trbRequestId="8d8bbac8-4ce5-43c5-9d47-a698be37d152"
        />
      </VerboseMockedProvider>
    );

    // Advice letter renders
    expect(getByText('Meeting summary text')).toBeInTheDocument();

    // Recommendation letter renders
    expect(getByText('Recommendation 1')).toBeInTheDocument();

    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
