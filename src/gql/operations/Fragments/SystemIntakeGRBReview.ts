import { gql } from '@apollo/client';

import SystemIntakeGRBReviewer from '../ITGov/GRBReview/SystemIntakeGRBReviewer';

import SystemIntakeGRBPresentationLinks from './SystemIntakeGRBPresentationLinks';

export default gql(/* GraphQL */ `
  ${SystemIntakeGRBPresentationLinks}
  ${SystemIntakeGRBReviewer}
  fragment SystemIntakeGRBReview on SystemIntake {
    id
    grbReviewStartedAt
    grbReviewType
    grbReviewAsyncEndDate

    grbDate
    grbReviewAsyncRecordingTime

    grbReviewers {
      ...SystemIntakeGRBReviewer
    }

    grbPresentationLinks {
      ...SystemIntakeGRBPresentationLinks
    }

    documents {
      ...SystemIntakeDocumentFragment
    }
  }
`);
