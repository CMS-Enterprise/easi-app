import { gql } from '@apollo/client';

const DeleteSystemIntakeGRBReviewerQuery = gql(/* GraphQL */ `
  mutation DeleteSystemIntakeGRBReviewer(
    $input: DeleteSystemIntakeGRBReviewerInput!
  ) {
    deleteSystemIntakeGRBReviewer(input: $input)
  }
`);

export default DeleteSystemIntakeGRBReviewerQuery;
