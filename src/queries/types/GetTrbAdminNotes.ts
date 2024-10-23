/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TRBAdminNoteCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTrbAdminNotes
// ====================================================

export interface GetTrbAdminNotes_trbRequest_adminNotes_author {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData {
  __typename: "TRBAdminNoteGeneralRequestCategoryData" | "TRBAdminNoteConsultSessionCategoryData";
}

export interface GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData {
  __typename: "TRBAdminNoteInitialRequestFormCategoryData";
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
}

export interface GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents {
  __typename: "TRBRequestDocument";
  fileName: string;
  deletedAt: Time | null;
}

export interface GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData {
  __typename: "TRBAdminNoteSupportingDocumentsCategoryData";
  documents: GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData_documents[];
}

export interface GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_insights {
  __typename: "TRBGuidanceLetterRecommendation";
  title: string;
  deletedAt: Time | null;
}

export interface GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData {
  __typename: "TRBAdminNoteGuidanceLetterCategoryData";
  appliesToMeetingSummary: boolean;
  appliesToNextSteps: boolean;
  insights: GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData_insights[];
}

export type GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData = GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData_TRBAdminNoteGeneralRequestCategoryData | GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData_TRBAdminNoteInitialRequestFormCategoryData | GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData_TRBAdminNoteSupportingDocumentsCategoryData | GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData_TRBAdminNoteGuidanceLetterCategoryData;

export interface GetTrbAdminNotes_trbRequest_adminNotes {
  __typename: "TRBAdminNote";
  id: UUID;
  isArchived: boolean;
  category: TRBAdminNoteCategory;
  noteText: HTML;
  author: GetTrbAdminNotes_trbRequest_adminNotes_author;
  createdAt: Time;
  categorySpecificData: GetTrbAdminNotes_trbRequest_adminNotes_categorySpecificData;
}

export interface GetTrbAdminNotes_trbRequest {
  __typename: "TRBRequest";
  id: UUID;
  adminNotes: GetTrbAdminNotes_trbRequest_adminNotes[];
}

export interface GetTrbAdminNotes {
  trbRequest: GetTrbAdminNotes_trbRequest;
}

export interface GetTrbAdminNotesVariables {
  id: UUID;
}
