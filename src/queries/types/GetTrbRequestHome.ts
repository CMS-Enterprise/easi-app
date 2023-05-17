/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBFormStatus, TRBAdviceLetterStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbRequestHome
// ====================================================

export interface GetTrbRequestHome_trbRequest_taskStatuses {
  __typename: "TRBTaskStatuses";
  formStatus: TRBFormStatus;
  adviceLetterStatus: TRBAdviceLetterStatus;
}

export interface GetTrbRequestHome_trbRequest_form {
  __typename: "TRBRequestForm";
  id: UUID;
  modifiedAt: Time | null;
}

export interface GetTrbRequestHome_trbRequest_adviceLetter {
  __typename: "TRBAdviceLetter";
  id: UUID;
  modifiedAt: Time | null;
}

export interface GetTrbRequestHome_trbRequest_trbLeadInfo {
  __typename: "UserInfo";
  commonName: string;
  email: string;
}

export interface GetTrbRequestHome_trbRequest_documents {
  __typename: "TRBRequestDocument";
  id: UUID;
}

export interface GetTrbRequestHome_trbRequest_adminNotes {
  __typename: "TRBAdminNote";
  id: UUID;
}

export interface GetTrbRequestHome_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  consultMeetingTime: Time | null;
  taskStatuses: GetTrbRequestHome_trbRequest_taskStatuses;
  form: GetTrbRequestHome_trbRequest_form;
  adviceLetter: GetTrbRequestHome_trbRequest_adviceLetter | null;
  trbLeadInfo: GetTrbRequestHome_trbRequest_trbLeadInfo;
  documents: GetTrbRequestHome_trbRequest_documents[];
  adminNotes: GetTrbRequestHome_trbRequest_adminNotes[];
}

export interface GetTrbRequestHome {
  trbRequest: GetTrbRequestHome_trbRequest;
}

export interface GetTrbRequestHomeVariables {
  id: UUID;
}
