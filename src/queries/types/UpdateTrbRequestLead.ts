/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTRBRequestTRBLeadInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTrbRequestLead
// ====================================================

export interface UpdateTrbRequestLead_updateTRBRequestTRBLead_trbLeadInfo {
  __typename: "UserInfo";
  commonName: string;
  email: EmailAddress;
  euaUserId: string;
}

export interface UpdateTrbRequestLead_updateTRBRequestTRBLead {
  __typename: "TRBRequest";
  id: UUID;
  trbLead: string | null;
  trbLeadInfo: UpdateTrbRequestLead_updateTRBRequestTRBLead_trbLeadInfo;
}

export interface UpdateTrbRequestLead {
  updateTRBRequestTRBLead: UpdateTrbRequestLead_updateTRBRequestTRBLead;
}

export interface UpdateTrbRequestLeadVariables {
  input: UpdateTRBRequestTRBLeadInput;
}
