import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTRBRequestType($id: UUID!, $type: TRBRequestType!) {
    updateTRBRequest(id: $id, changes: { type: $type }) {
      id
      type
    }
  }
`);
