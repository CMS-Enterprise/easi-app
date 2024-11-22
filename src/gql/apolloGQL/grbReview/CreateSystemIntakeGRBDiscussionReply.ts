import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeGRBDiscussionReply(
    $input: createSystemIntakeGRBDiscussionReplyInput!
  ) {
    createSystemIntakeGRBDiscussionReply(input: $input) {
      id
    }
  }
`);
