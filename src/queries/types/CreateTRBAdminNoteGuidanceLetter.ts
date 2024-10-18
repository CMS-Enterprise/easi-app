/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteGuidanceLetterInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBAdminNoteGuidanceLetter
// ====================================================

export interface CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData {
  __typename: "TRBAdminNoteGeneralRequestCategoryData" | "TRBAdminNoteConsultSessionCategoryData";
}

export interface CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData {
  __typename: "TRBAdminNoteInitialRequestFormCategoryData";
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
}

export interface CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents {
  __typename: "TRBRequestDocument";
  fileName: string;
  deletedAt: Time | null;
}

export interface CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData {
  __typename: "TRBAdminNoteSupportingDocumentsCategoryData";
  documents: CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents[];
}

export interface CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_recommendations {
  __typename: "TRBGuidanceLetterRecommendation";
  title: string;
  deletedAt: Time | null;
}

export interface CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData {
  __typename: "TRBAdminNoteGuidanceLetterCategoryData";
  appliesToMeetingSummary: boolean;
  appliesToNextSteps: boolean;
  recommendations: CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_recommendations[];
}

export type CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData = CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData | CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData | CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData | CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData;

export interface CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_author;
  createdAt: Time;
  categorySpecificData: CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter_categorySpecificData;
}

export interface CreateTRBAdminNoteGuidanceLetter {
  createTRBAdminNoteGuidanceLetter: CreateTRBAdminNoteGuidanceLetter_createTRBAdminNoteGuidanceLetter;
}

export interface CreateTRBAdminNoteGuidanceLetterVariables {
  input: CreateTRBAdminNoteGuidanceLetterInput;
}
