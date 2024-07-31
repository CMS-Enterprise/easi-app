/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTRBAdminNoteAdviceLetterInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTRBAdminNoteAdviceLetter
// ====================================================

export interface CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData {
  __typename: "TRBAdminNoteGeneralRequestCategoryData" | "TRBAdminNoteConsultSessionCategoryData";
}

export interface CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData {
  __typename: "TRBAdminNoteInitialRequestFormCategoryData";
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
}

export interface CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents {
  __typename: "TRBRequestDocument";
  fileName: string;
  deletedAt: Time | null;
}

export interface CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData {
  __typename: "TRBAdminNoteSupportingDocumentsCategoryData";
  documents: CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents[];
}

export interface CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData_TRBAdminNoteAdviceLetterCategoryData_recommendations {
  __typename: "TRBAdviceLetterRecommendation";
  title: string;
  deletedAt: Time | null;
}

export interface CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData_TRBAdminNoteAdviceLetterCategoryData {
  __typename: "TRBAdminNoteAdviceLetterCategoryData";
  appliesToMeetingSummary: boolean;
  appliesToNextSteps: boolean;
  recommendations: CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData_TRBAdminNoteAdviceLetterCategoryData_recommendations[];
}

export type CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData = CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData | CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData | CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData | CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData_TRBAdminNoteAdviceLetterCategoryData;

export interface CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_author;
  createdAt: Time;
  categorySpecificData: CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter_categorySpecificData;
}

export interface CreateTRBAdminNoteAdviceLetter {
  createTRBAdminNoteAdviceLetter: CreateTRBAdminNoteAdviceLetter_createTRBAdminNoteAdviceLetter;
}

export interface CreateTRBAdminNoteAdviceLetterVariables {
  input: CreateTRBAdminNoteAdviceLetterInput;
}
