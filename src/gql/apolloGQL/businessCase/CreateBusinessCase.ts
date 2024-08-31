import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateBusinessCase($systemIntakeID: UUID!) {
    createBusinessCase(systemIntakeID: $systemIntakeID) {
      id
    }
  }
`);
