import { gql } from '@apollo/client';

import SystemIntakeGRBReviewer from './SystemIntakeGRBReviewer';

const UpdateSystemIntakeGRBReviewer = gql(/* GraphQL */ `
  ${SystemIntakeGRBReviewer}
  mutation UpdateSystemIntakeGRBReviewer(
    $input: UpdateSystemIntakeGRBReviewerInput!
  ) {
    updateSystemIntakeGRBReviewer(input: $input) {
      ...SystemIntakeGRBReviewer
    }
  }
`);

export default UpdateSystemIntakeGRBReviewer;
