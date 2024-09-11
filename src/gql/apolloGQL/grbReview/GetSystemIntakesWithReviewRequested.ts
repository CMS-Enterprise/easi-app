import { gql } from '@apollo/client';

export const SystemIntakeWithReviewRequested = gql(/* GraphQL */ `
  fragment SystemIntakeWithReviewRequested on SystemIntake {
    id
    requestName
    requesterName
    requesterComponent
    grbDate
  }
`);

export default gql(/* GraphQL */ `
  ${SystemIntakeWithReviewRequested}
  query GetSystemIntakesWithReviewRequested {
    systemIntakesWithReviewRequested {
      ...SystemIntakeWithReviewRequested
    }
  }
`);
