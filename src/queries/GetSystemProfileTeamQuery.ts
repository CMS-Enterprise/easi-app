import { gql } from '@apollo/client';

export default gql`
  query GetSystemProfileTeam($systemId: String!) {
    roles(systemId: $systemId) {
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
