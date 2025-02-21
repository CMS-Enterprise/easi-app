import { gql } from '@apollo/client';

import SystemIntakeGRBReviewer from './SystemIntakeGRBReviewer';

const CreateSystemIntakeGRBReviewers = gql(/* GraphQL */ `
  ${SystemIntakeGRBReviewer}
  mutation CreateSystemIntakeGRBReviewers(
    $input: CreateSystemIntakeGRBReviewersInput!
  ) {
    createSystemIntakeGRBReviewers(input: $input) {
      reviewers {
        ...SystemIntakeGRBReviewer
      }
    }
  }
`);

export default CreateSystemIntakeGRBReviewers;
