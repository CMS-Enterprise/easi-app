import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateSystemIntakeGRBDiscussionPost(
    $input: createSystemIntakeGRBDiscussionPostInput!
  ) {
    createSystemIntakeGRBDiscussionPost(input: $input) {
      id
    }
  }
`);
