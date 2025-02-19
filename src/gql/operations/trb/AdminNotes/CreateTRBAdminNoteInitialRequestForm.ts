import { gql } from '@apollo/client';

import TRBAdminNote from './TRBAdminNote';

export default gql(/* GraphQL */ `
  ${TRBAdminNote}
  mutation CreateTRBAdminNoteInitialRequestForm(
    $input: CreateTRBAdminNoteInitialRequestFormInput!
  ) {
    createTRBAdminNoteInitialRequestForm(input: $input) {
      ...TRBAdminNote
    }
  }
`);
