/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteSupportingDocumentsInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBAdminNoteSupportingDocuments
// ====================================================

export interface CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData {
  __typename: "TRBAdminNoteGeneralRequestCategoryData" | "TRBAdminNoteConsultSessionCategoryData";
}

export interface CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData {
  __typename: "TRBAdminNoteInitialRequestFormCategoryData";
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
}

export interface CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents {
  __typename: "TRBRequestDocument";
  fileName: string;
  deletedAt: Time | null;
}

export interface CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData {
  __typename: "TRBAdminNoteSupportingDocumentsCategoryData";
  documents: CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents[];
}

export interface CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_recommendations {
  __typename: "TRBGuidanceLetterRecommendation";
  title: string;
  deletedAt: Time | null;
}

export interface CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData {
  __typename: "TRBAdminNoteGuidanceLetterCategoryData";
  appliesToMeetingSummary: boolean;
  appliesToNextSteps: boolean;
  recommendations: CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_recommendations[];
}

export type CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData = CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData | CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData | CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData | CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData;

export interface CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_author;
  createdAt: Time;
  categorySpecificData: CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments_categorySpecificData;
}

export interface CreateTRBAdminNoteSupportingDocuments {
  createTRBAdminNoteSupportingDocuments: CreateTRBAdminNoteSupportingDocuments_createTRBAdminNoteSupportingDocuments;
}

export interface CreateTRBAdminNoteSupportingDocumentsVariables {
  input: CreateTRBAdminNoteSupportingDocumentsInput;
}
