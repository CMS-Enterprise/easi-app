import { gql } from '@apollo/client';

import TRBAdminNote from './TRBAdminNote';

export default gql(/* GraphQL */ `
  ${TRBAdminNote}
  mutation CreateTRBAdminNoteGuidanceLetter(
    $input: CreateTRBAdminNoteGuidanceLetterInput!
  ) {
    createTRBAdminNoteGuidanceLetter(input: $input) {
      ...TRBAdminNote
    }
  }
`);
