/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBRequestFundingSourcesInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTRBRequestFundingSources
// ====================================================

export interface UpdateTRBRequestFundingSources_updateTRBRequestFundingSources {
  __typename: "TRBFundingSource";
  source: string;
  fundingNumber: string;
  id: UUID;
  createdAt: Time;
}

export interface UpdateTRBRequestFundingSources {
  updateTRBRequestFundingSources: UpdateTRBRequestFundingSources_updateTRBRequestFundingSources[];
}

export interface UpdateTRBRequestFundingSourcesVariables {
  input: UpdateTRBRequestFundingSourcesInput;
}
