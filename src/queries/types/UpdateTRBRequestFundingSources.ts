/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

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
  trbRequestId: UUID;
  sources: string[];
  fundingNumber: string;
}
