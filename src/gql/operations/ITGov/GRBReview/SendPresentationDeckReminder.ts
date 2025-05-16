import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation SendPresentationDeckReminder($systemIntakeID: UUID!) {
    sendGRBReviewPresentationDeckReminderEmail(systemIntakeID: $systemIntakeID)
  }
`);
