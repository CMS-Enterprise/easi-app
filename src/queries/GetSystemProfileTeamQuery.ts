import { gql } from '@apollo/client';

export default gql`
  query GetSystemProfileTeam($systemId: String!) {
    roles(cedarSystemId: $systemId) {
      application
      objectID
      roleTypeID
      assigneeType
      assigneeUsername
      assigneeEmail
      assigneeOrgID
      assigneeOrgName
      assigneeFirstName
      assigneeLastName
      roleTypeName
      roleID
    }
  }
`;
