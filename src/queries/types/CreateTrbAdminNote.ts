/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {  CreateTRBAdminNoteGeneralRequestInput, TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTrbAdminNote
// ====================================================

export interface CreateTrbAdminNote_createTRBAdminNote_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface CreateTrbAdminNote_createTRBAdminNote_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData {
  __typename: "TRBAdminNoteGeneralRequestCategoryData" | "TRBAdminNoteConsultSessionCategoryData";
}

export interface CreateTrbAdminNote_createTRBAdminNote_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData {
  __typename: "TRBAdminNoteInitialRequestFormCategoryData";
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
}

export interface CreateTrbAdminNote_createTRBAdminNote_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents {
  __typename: "TRBRequestDocument";
  fileName: string;
  deletedAt: Time | null;
}

export interface CreateTrbAdminNote_createTRBAdminNote_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData {
  __typename: "TRBAdminNoteSupportingDocumentsCategoryData";
  documents: CreateTrbAdminNote_createTRBAdminNote_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents[];
}

export interface CreateTrbAdminNote_createTRBAdminNote_categorySpecificData_TRBAdminNoteAdviceLetterCategoryData_recommendations {
  __typename: "TRBAdviceLetterRecommendation";
  title: string;
  deletedAt: Time | null;
}

export interface CreateTrbAdminNote_createTRBAdminNote_categorySpecificData_TRBAdminNoteAdviceLetterCategoryData {
  __typename: "TRBAdminNoteAdviceLetterCategoryData";
  appliesToMeetingSummary: boolean;
  appliesToNextSteps: boolean;
  recommendations: CreateTrbAdminNote_createTRBAdminNote_categorySpecificData_TRBAdminNoteAdviceLetterCategoryData_recommendations[];
}

export type CreateTrbAdminNote_createTRBAdminNote_categorySpecificData = CreateTrbAdminNote_createTRBAdminNote_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData | CreateTrbAdminNote_createTRBAdminNote_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData | CreateTrbAdminNote_createTRBAdminNote_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData | CreateTrbAdminNote_createTRBAdminNote_categorySpecificData_TRBAdminNoteAdviceLetterCategoryData;

export interface CreateTrbAdminNote_createTRBAdminNote {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: CreateTrbAdminNote_createTRBAdminNote_author;
  createdAt: Time;
  categorySpecificData: CreateTrbAdminNote_createTRBAdminNote_categorySpecificData;
}

export interface CreateTrbAdminNote {
  createTRBAdminNote: CreateTrbAdminNote_createTRBAdminNote;
}

export interface CreateTrbAdminNoteGeneralVariables {
  input: CreateTRBAdminNoteGeneralRequestInput;
}
