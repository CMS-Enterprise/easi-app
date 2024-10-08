/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL fragment: TRBAdminNoteFragment
// ====================================================

export interface TRBAdminNoteFragment_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData {
  __typename: "TRBAdminNoteGeneralRequestCategoryData" | "TRBAdminNoteConsultSessionCategoryData";
}

export interface TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData {
  __typename: "TRBAdminNoteInitialRequestFormCategoryData";
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
}

export interface TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents {
  __typename: "TRBRequestDocument";
  fileName: string;
  deletedAt: Time | null;
}

export interface TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData {
  __typename: "TRBAdminNoteSupportingDocumentsCategoryData";
  documents: TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents[];
}

export interface TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_recommendations {
  __typename: "TRBGuidanceLetterRecommendation";
  title: string;
  deletedAt: Time | null;
}

export interface TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData {
  __typename: "TRBAdminNoteGuidanceLetterCategoryData";
  appliesToMeetingSummary: boolean;
  appliesToNextSteps: boolean;
  recommendations: TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_recommendations[];
}

export type TRBAdminNoteFragment_categorySpecificData = TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData | TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData | TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData | TRBAdminNoteFragment_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData;

export interface TRBAdminNoteFragment {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: TRBAdminNoteFragment_author;
  createdAt: Time;
  categorySpecificData: TRBAdminNoteFragment_categorySpecificData;
}
