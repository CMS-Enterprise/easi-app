import { gql } from '@apollo/client';
import SystemIntakeGRBReview from 'gql/operations/Fragments/SystemIntakeGRBReview';

export default gql(/* GraphQL */ `
  ${SystemIntakeGRBReview}
  query GetSystemIntakeGRBReview($id: UUID!) {
    systemIntake(id: $id) {
      ...SystemIntakeGRBReview
    }
  }
`);
