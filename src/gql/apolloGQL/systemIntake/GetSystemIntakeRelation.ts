import { gql } from '@apollo/client';

const GetSystemIntakeRelationQuery = gql(/* GraphQL */ `
  query GetSystemIntakeRelation($id: UUID!) {
    systemIntake(id: $id) {
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

export default GetSystemIntakeRelationQuery;
