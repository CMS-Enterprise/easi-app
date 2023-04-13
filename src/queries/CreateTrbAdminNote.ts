import { gql } from '@apollo/client';

import { TRBAdminNoteFragment } from './GetTrbAdminNotesQuery';

export default gql`
  ${TRBAdminNoteFragment}
  mutation CreateTrbAdminNote($input: CreateTRBAdminNoteInput!) {
    createTRBAdminNote(input: $input) {
      ...TRBAdminNoteFragment
    }
  }
`;
