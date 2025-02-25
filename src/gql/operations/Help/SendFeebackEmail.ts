import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation SendFeedbackEmail($input: SendFeedbackEmailInput!) {
    sendFeedbackEmail(input: $input)
  }
`);
