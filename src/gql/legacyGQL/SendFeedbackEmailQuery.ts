import { gql } from '@apollo/client';

export default gql`
  mutation SendFeedbackEmail($input: SendFeedbackEmailInput!) {
    sendFeedbackEmail(input: $input)
  }
`;
