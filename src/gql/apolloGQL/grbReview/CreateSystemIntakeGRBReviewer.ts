import { gql } from '@apollo/client';

import SystemIntakeGRBReviewer from './SystemIntakeGRBReviewer';

const CreateSystemIntakeGRBReviewer = gql(/* GraphQL */ `
  ${SystemIntakeGRBReviewer}
  mutation CreateSystemIntakeGRBReviewer(
    $input: CreateSystemIntakeGRBReviewerInput!
  ) {
    createSystemIntakeGRBReviewer(input: $input) {
      ...SystemIntakeGRBReviewer
    }
  }
`);

export default CreateSystemIntakeGRBReviewer;
