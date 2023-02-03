/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBFormStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbRequestFormStatus
// ====================================================

export interface UpdateTrbRequestFormStatus_updateTRBRequestForm {
  __typename: "TRBRequestForm";
  status: TRBFormStatus;
}

export interface UpdateTrbRequestFormStatus {
  updateTRBRequestForm: UpdateTrbRequestFormStatus_updateTRBRequestForm;
}

export interface UpdateTrbRequestFormStatusVariables {
  isSubmitted: boolean;
  trbRequestId: UUID;
}
