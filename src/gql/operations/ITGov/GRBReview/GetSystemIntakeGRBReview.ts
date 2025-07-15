import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetSystemIntakeGRBReview($id: UUID!) {
    systemIntake(id: $id) {
      ...SystemIntakeGRBReview
    }
  }
`);
