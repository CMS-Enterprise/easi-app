import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetSystemTeamMembers($cedarSystemId: String!) {
    cedarSystemDetails(cedarSystemId: $cedarSystemId) {
      roles {
        assigneeUsername
      }
    }
  }
`);
