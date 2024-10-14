/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteInitialRequestFormInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBAdminNoteInitialRequestForm
// ====================================================

export interface CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData {
  __typename: "TRBAdminNoteGeneralRequestCategoryData" | "TRBAdminNoteConsultSessionCategoryData";
}

export interface CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData {
  __typename: "TRBAdminNoteInitialRequestFormCategoryData";
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
}

export interface CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents {
  __typename: "TRBRequestDocument";
  fileName: string;
  deletedAt: Time | null;
}

export interface CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData {
  __typename: "TRBAdminNoteSupportingDocumentsCategoryData";
  documents: CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents[];
}

export interface CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_recommendations {
  __typename: "TRBGuidanceLetterRecommendation";
  title: string;
  deletedAt: Time | null;
}

export interface CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData {
  __typename: "TRBAdminNoteGuidanceLetterCategoryData";
  appliesToMeetingSummary: boolean;
  appliesToNextSteps: boolean;
  recommendations: CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_recommendations[];
}

export type CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData = CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData | CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData | CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData | CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData;

export interface CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_author;
  createdAt: Time;
  categorySpecificData: CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm_categorySpecificData;
}

export interface CreateTRBAdminNoteInitialRequestForm {
  createTRBAdminNoteInitialRequestForm: CreateTRBAdminNoteInitialRequestForm_createTRBAdminNoteInitialRequestForm;
}

export interface CreateTRBAdminNoteInitialRequestFormVariables {
  input: CreateTRBAdminNoteInitialRequestFormInput;
}
