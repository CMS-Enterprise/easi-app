import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTrbRequestArchived($id: UUID!, $archived: Boolean!) {
    updateTRBRequest(id: $id, changes: { archived: $archived }) {
      id
      archived
    }
  }
`);
