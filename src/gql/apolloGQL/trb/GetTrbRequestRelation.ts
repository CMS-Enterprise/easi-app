import { gql } from '@apollo/client';

const GetTrbRequestRelationQuery = gql(/* GraphQL */ `
  query GetTrbRequestRelation($id: UUID!) {
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
    }
  }
`);

export default GetTrbRequestRelationQuery;
