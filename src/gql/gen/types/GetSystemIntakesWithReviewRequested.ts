/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSystemIntakesWithReviewRequested
// ====================================================

export interface GetSystemIntakesWithReviewRequested_systemIntakesWithReviewRequested {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  requesterName: string | null;
  grbDate: Time | null;
}

export interface GetSystemIntakesWithReviewRequested {
  systemIntakesWithReviewRequested: GetSystemIntakesWithReviewRequested_systemIntakesWithReviewRequested[];
}
