/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteConsultSessionInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBAdminNoteConsultSession
// ====================================================

export interface CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData {
  __typename: "TRBAdminNoteGeneralRequestCategoryData" | "TRBAdminNoteConsultSessionCategoryData";
}

export interface CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData {
  __typename: "TRBAdminNoteInitialRequestFormCategoryData";
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
}

export interface CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents {
  __typename: "TRBRequestDocument";
  fileName: string;
  deletedAt: Time | null;
}

export interface CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData {
  __typename: "TRBAdminNoteSupportingDocumentsCategoryData";
  documents: CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents[];
}

export interface CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_recommendations {
  __typename: "TRBGuidanceLetterRecommendation";
  title: string;
  deletedAt: Time | null;
}

export interface CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData {
  __typename: "TRBAdminNoteGuidanceLetterCategoryData";
  appliesToMeetingSummary: boolean;
  appliesToNextSteps: boolean;
  recommendations: CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_recommendations[];
}

export type CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData = CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData | CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData | CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData | CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData;

export interface CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_author;
  createdAt: Time;
  categorySpecificData: CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession_categorySpecificData;
}

export interface CreateTRBAdminNoteConsultSession {
  createTRBAdminNoteConsultSession: CreateTRBAdminNoteConsultSession_createTRBAdminNoteConsultSession;
}

export interface CreateTRBAdminNoteConsultSessionVariables {
  input: CreateTRBAdminNoteConsultSessionInput;
}
