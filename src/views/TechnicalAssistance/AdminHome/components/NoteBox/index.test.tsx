import React from 'react';
import { render } from '@testing-library/react';

import NoteBox from '.';

describe('TRB Admin Note Box', () => {
  it('Renders correct note count information', async () => {
    const { asFragment, getByTestId } = render(
      <NoteBox
        trbRequestId="861fa6c5-c9af-4cda-a559-0995b7b76855"
        noteCount={4}
        activePage="guidance"
      />
    );

    expect(getByTestId('note-box-count').textContent).toBe(
      '4 notes about this request'
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
