/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteGeneralRequestInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBAdminNoteGeneralRequest
// ====================================================

export interface CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData {
  __typename: "TRBAdminNoteGeneralRequestCategoryData" | "TRBAdminNoteConsultSessionCategoryData";
}

export interface CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData {
  __typename: "TRBAdminNoteInitialRequestFormCategoryData";
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
}

export interface CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents {
  __typename: "TRBRequestDocument";
  fileName: string;
  deletedAt: Time | null;
}

export interface CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData {
  __typename: "TRBAdminNoteSupportingDocumentsCategoryData";
  documents: CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents[];
}

export interface CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_insights {
  __typename: "TRBGuidanceLetterRecommendation";
  title: string;
  deletedAt: Time | null;
}

export interface CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData {
  __typename: "TRBAdminNoteGuidanceLetterCategoryData";
  appliesToMeetingSummary: boolean;
  appliesToNextSteps: boolean;
  insights: CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_insights[];
}

export type CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData = CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData | CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData | CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData | CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData;

export interface CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_author;
  createdAt: Time;
  categorySpecificData: CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest_categorySpecificData;
}

export interface CreateTRBAdminNoteGeneralRequest {
  createTRBAdminNoteGeneralRequest: CreateTRBAdminNoteGeneralRequest_createTRBAdminNoteGeneralRequest;
}

export interface CreateTRBAdminNoteGeneralRequestVariables {
  input: CreateTRBAdminNoteGeneralRequestInput;
}
