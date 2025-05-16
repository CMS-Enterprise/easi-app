import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CastGRBReviewerVote($input: CastSystemIntakeGRBReviewerVoteInput!) {
    castSystemIntakeGRBReviewerVote(input: $input) {
      id
    }
  }
`);
