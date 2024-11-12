import { gql } from '@apollo/client';

import TRBAdminNote from './TRBAdminNote';

export default gql(/* GraphQL */ `
  ${TRBAdminNote}
  mutation CreateTRBAdminNoteConsultSession(
    $input: CreateTRBAdminNoteConsultSessionInput!
  ) {
    createTRBAdminNoteConsultSession(input: $input) {
      ...TRBAdminNote
    }
  }
`);
