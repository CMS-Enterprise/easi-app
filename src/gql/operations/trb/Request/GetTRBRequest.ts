import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBRequest($id: UUID!) {
    trbRequest(id: $id) {
      ...TrbRequestFormFieldsFragment
    }
  }
`);
