import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  getTRBGuidanceLetterInsightsQuery,
  guidanceLetter,
  trbRequest
} from 'tests/mock/trbRequest';

import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import ReviewGuidanceLetter from '.';

describe('TRB Guidance Letter review component', () => {
  it('Matches the snapshot', async () => {
    const { asFragment } = render(
      <VerboseMockedProvider mocks={[getTRBGuidanceLetterInsightsQuery]}>
        <ReviewGuidanceLetter
          guidanceLetter={guidanceLetter}
          trbRequestId={trbRequest.id}
        />
      </VerboseMockedProvider>
    );

    // Guidance letter renders
    expect(screen.getByText('Meeting summary text')).toBeInTheDocument();

    // Guidance letter renders
    expect(await screen.findByText('Insight 1')).toBeInTheDocument();

    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
