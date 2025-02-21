import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query getGRBReviewersComparisons($id: UUID!) {
    compareGRBReviewersByIntakeID(id: $id) {
      id
      requestName
      reviewers {
        id
        grbRole
        votingRole
        userAccount {
          id
          username
          commonName
          email
        }
        isCurrentReviewer
      }
    }
  }
`);
