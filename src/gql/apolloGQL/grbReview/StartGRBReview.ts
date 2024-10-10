import { gql } from '@apollo/client';

const StartGRBReview = gql(/* GraphQL */ `
  mutation StartGRBReview($input: StartGRBReviewInput!) {
    startGRBReview(input: $input)
  }
`);

export default StartGRBReview;
