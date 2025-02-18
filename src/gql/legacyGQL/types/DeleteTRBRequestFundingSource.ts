/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteTRBRequestFundingSourcesInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: DeleteTRBRequestFundingSource
// ====================================================

export interface DeleteTRBRequestFundingSource_deleteTRBRequestFundingSources {
  __typename: "TRBFundingSource";
  id: UUID;
}

export interface DeleteTRBRequestFundingSource {
  deleteTRBRequestFundingSources: DeleteTRBRequestFundingSource_deleteTRBRequestFundingSources[];
}

export interface DeleteTRBRequestFundingSourceVariables {
  input: DeleteTRBRequestFundingSourcesInput;
}
