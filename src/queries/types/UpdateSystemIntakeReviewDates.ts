/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateSystemIntakeReviewDatesInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateSystemIntakeReviewDates
// ====================================================

export interface UpdateSystemIntakeReviewDates_updateSystemIntakeReviewDates_systemIntake {
  __typename: "SystemIntake";
  adminLead: string | null;
  id: UUID;
}

export interface UpdateSystemIntakeReviewDates_updateSystemIntakeReviewDates {
  __typename: "UpdateSystemIntakePayload";
  systemIntake: UpdateSystemIntakeReviewDates_updateSystemIntakeReviewDates_systemIntake | null;
}

export interface UpdateSystemIntakeReviewDates {
  updateSystemIntakeReviewDates: UpdateSystemIntakeReviewDates_updateSystemIntakeReviewDates | null;
}

export interface UpdateSystemIntakeReviewDatesVariables {
  input: UpdateSystemIntakeReviewDatesInput;
}
