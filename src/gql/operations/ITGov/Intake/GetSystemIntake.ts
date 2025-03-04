import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetSystemIntake($id: UUID!) {
    systemIntake(id: $id) {
      ...SystemIntakeFragment
    }
  }
`);
