import { gql } from '@apollo/client';

export default gql`
  mutation UpdateTrbRequest($id: UUID!, $changes: TRBRequestChanges) {
    updateTRBRequest(id: $id, changes: $changes) {
      name
      archived
      type
      status
    }
  }
`;
