import React from 'react';
import { render } from '@testing-library/react';

import NoteBox from '.';

describe('TRB Admin Note', () => {
  it('Renders correct note information', async () => {
    const { findByText, asFragment } = render(
      <NoteBox
        trbRequestId="861fa6c5-c9af-4cda-a559-0995b7b76855"
        noteCount={4}
      />
    );

    const submissionDate = await findByText('March 28, 2023');
    expect(submissionDate).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
