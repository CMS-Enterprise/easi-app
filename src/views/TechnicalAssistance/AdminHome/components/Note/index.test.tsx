import React from 'react';
import { render } from '@testing-library/react';

import { GetTrbAdminNotes_trbRequest_adminNotes as NoteType } from 'queries/types/GetTrbAdminNotes';
import { TRBAdminNoteCategory } from 'types/graphql-global-types';

import Note from '.';

const note: NoteType = {
  id: '861fa6c5-c9af-4cda-a559-0995b7b76855',
  isArchived: false,
  category: TRBAdminNoteCategory.GENERAL_REQUEST,
  noteText: 'My cute note',
  author: {
    __typename: 'UserInfo',
    commonName: 'Jerry Seinfeld'
  },
  createdAt: '2023-03-28T13:20:37.852099Z',
  __typename: 'TRBAdminNote',
  categorySpecificData: {
    __typename: 'TRBAdminNoteGeneralRequestCategoryData'
  }
};

describe('TRB Admin Note', () => {
  it('Renders correct note information', async () => {
    const { findByText, asFragment } = render(<Note note={note} />);

    const submissionDate = await findByText('March 28, 2023');
    expect(submissionDate).toBeInTheDocument();

    const author = await findByText('Jerry Seinfeld');
    expect(author).toBeInTheDocument();

    const noteText = await findByText('My cute note');
    expect(noteText).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
