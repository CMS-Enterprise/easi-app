import { gql } from '@apollo/client';

export default gql`
  mutation UpdateTrbRequestType($id: UUID!, $type: TRBRequestType!) {
    updateTRBRequest(id: $id, changes: { type: $type }) {
      id
      type
    }
  }
`;
