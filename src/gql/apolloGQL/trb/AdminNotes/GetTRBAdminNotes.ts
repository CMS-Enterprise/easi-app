import { gql } from '@apollo/client';

import TRBAdminNote from './TRBAdminNote';

export default gql(/* GraphQL */ `
  ${TRBAdminNote}
  query GetTRBAdminNotes($id: UUID!) {
    trbRequest(id: $id) {
      id
      adminNotes {
        ...TRBAdminNote
      }
    }
  }
`);
