/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * SystemIntakeState represents whether the intake is open or closed
 */
export enum SystemIntakeState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

/**
 * This represents the (calculated) statuses that a requester view of a system Intake Request can show as part of the IT Gov v2 workflow
 */
export enum SystemIntakeStatusRequester {
  CLOSED = "CLOSED",
  DRAFT_BUSINESS_CASE_EDITS_REQUESTED = "DRAFT_BUSINESS_CASE_EDITS_REQUESTED",
  DRAFT_BUSINESS_CASE_IN_PROGRESS = "DRAFT_BUSINESS_CASE_IN_PROGRESS",
  DRAFT_BUSINESS_CASE_SUBMITTED = "DRAFT_BUSINESS_CASE_SUBMITTED",
  FINAL_BUSINESS_CASE_EDITS_REQUESTED = "FINAL_BUSINESS_CASE_EDITS_REQUESTED",
  FINAL_BUSINESS_CASE_IN_PROGRESS = "FINAL_BUSINESS_CASE_IN_PROGRESS",
  FINAL_BUSINESS_CASE_SUBMITTED = "FINAL_BUSINESS_CASE_SUBMITTED",
  GRB_MEETING_AWAITING_DECISION = "GRB_MEETING_AWAITING_DECISION",
  GRB_MEETING_READY = "GRB_MEETING_READY",
  GRT_MEETING_AWAITING_DECISION = "GRT_MEETING_AWAITING_DECISION",
  GRT_MEETING_READY = "GRT_MEETING_READY",
  INITIAL_REQUEST_FORM_EDITS_REQUESTED = "INITIAL_REQUEST_FORM_EDITS_REQUESTED",
  INITIAL_REQUEST_FORM_IN_PROGRESS = "INITIAL_REQUEST_FORM_IN_PROGRESS",
  INITIAL_REQUEST_FORM_NEW = "INITIAL_REQUEST_FORM_NEW",
  INITIAL_REQUEST_FORM_SUBMITTED = "INITIAL_REQUEST_FORM_SUBMITTED",
  LCID_EXPIRED = "LCID_EXPIRED",
  LCID_ISSUED = "LCID_ISSUED",
  LCID_RETIRED = "LCID_RETIRED",
  NOT_APPROVED = "NOT_APPROVED",
  NOT_GOVERNANCE = "NOT_GOVERNANCE",
}

/**
 * Different options for whether the Governance team believes a requester's team should consult with the TRB
 */
export enum SystemIntakeTRBFollowUp {
  NOT_RECOMMENDED = "NOT_RECOMMENDED",
  RECOMMENDED_BUT_NOT_CRITICAL = "RECOMMENDED_BUT_NOT_CRITICAL",
  STRONGLY_RECOMMENDED = "STRONGLY_RECOMMENDED",
}

export enum TRBRequestState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

export enum TRBRequestStatus {
  CONSULT_COMPLETE = "CONSULT_COMPLETE",
  CONSULT_SCHEDULED = "CONSULT_SCHEDULED",
  DRAFT_GUIDANCE_LETTER = "DRAFT_GUIDANCE_LETTER",
  DRAFT_REQUEST_FORM = "DRAFT_REQUEST_FORM",
  FOLLOW_UP_REQUESTED = "FOLLOW_UP_REQUESTED",
  GUIDANCE_LETTER_IN_REVIEW = "GUIDANCE_LETTER_IN_REVIEW",
  GUIDANCE_LETTER_SENT = "GUIDANCE_LETTER_SENT",
  NEW = "NEW",
  READY_FOR_CONSULT = "READY_FOR_CONSULT",
  REQUEST_FORM_COMPLETE = "REQUEST_FORM_COMPLETE",
}

//==============================================================
// END Enums and Input Objects
//==============================================================
