import { gql } from '@apollo/client';

export const TRBAdminNoteFragment = gql`
  fragment TRBAdminNoteFragment on TRBAdminNote {
    id
    isArchived
    category
    noteText
    author {
      commonName
    }
    createdAt
  }
`;

export default gql`
  ${TRBAdminNoteFragment}
  query GetTrbAdminNotes($id: UUID!) {
    trbRequest(id: $id) {
      id
      adminNotes {
        ...TRBAdminNoteFragment
      }
    }
  }
`;
