import { gql } from '@apollo/client';

import TRBAdminNote from './TRBAdminNote';

export default gql(/* GraphQL */ `
  ${TRBAdminNote}
  mutation CreateTRBAdminNoteGeneralRequest(
    $input: CreateTRBAdminNoteGeneralRequestInput!
  ) {
    createTRBAdminNoteGeneralRequest(input: $input) {
      ...TRBAdminNote
    }
  }
`);
