import { gql } from '@apollo/client';

import TRBAdminNote from './TRBAdminNote';

export default gql(/* GraphQL */ `
  ${TRBAdminNote}
  mutation CreateTRBAdminNoteSupportingDocuments(
    $input: CreateTRBAdminNoteSupportingDocumentsInput!
  ) {
    createTRBAdminNoteSupportingDocuments(input: $input) {
      ...TRBAdminNote
    }
  }
`);
