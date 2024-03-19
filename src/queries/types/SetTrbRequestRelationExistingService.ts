/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SetTRBRequestRelationExistingServiceInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: SetTrbRequestRelationExistingService
// ====================================================

export interface SetTrbRequestRelationExistingService_setTRBRequestRelationExistingService {
  __typename: "TRBRequest";
  id: UUID;
}

export interface SetTrbRequestRelationExistingService {
  setTRBRequestRelationExistingService: SetTrbRequestRelationExistingService_setTRBRequestRelationExistingService | null;
}

export interface SetTrbRequestRelationExistingServiceVariables {
  input: SetTRBRequestRelationExistingServiceInput;
}
