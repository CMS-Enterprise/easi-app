import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation SendSystemIntakeGRBReviewerReminder($systemIntakeID: UUID!) {
    sendSystemIntakeGRBReviewerReminder(systemIntakeID: $systemIntakeID) {
      timeSent
    }
  }
`);
