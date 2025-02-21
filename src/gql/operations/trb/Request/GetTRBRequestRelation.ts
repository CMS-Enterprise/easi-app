import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetTRBRequestRelation($id: UUID!) {
    trbRequest(id: $id) {
      id
      relationType
      contractName
      contractNumbers {
        contractNumber
      }
      systems {
        id
        name
        acronym
      }
    }
    cedarSystems {
      id
      name
      acronym
    }
  }
`);
