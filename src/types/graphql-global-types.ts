/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Represents the possible forms on a governance request that can receive feedback
 */
export enum GovernanceRequestFeedbackTargetForm {
  DRAFT_BUSINESS_CASE = "DRAFT_BUSINESS_CASE",
  FINAL_BUSINESS_CASE = "FINAL_BUSINESS_CASE",
  INTAKE_REQUEST = "INTAKE_REQUEST",
  NO_TARGET_PROVIDED = "NO_TARGET_PROVIDED",
}

/**
 * The requester view of the IT gov Decision step status
 */
export enum ITGovDecisionStatus {
  CANT_START = "CANT_START",
  COMPLETED = "COMPLETED",
  IN_REVIEW = "IN_REVIEW",
}

/**
 * The requester view of the IT gov draft Business Case step status
 */
export enum ITGovDraftBusinessCaseStatus {
  CANT_START = "CANT_START",
  DONE = "DONE",
  EDITS_REQUESTED = "EDITS_REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_NEEDED = "NOT_NEEDED",
  READY = "READY",
  SUBMITTED = "SUBMITTED",
}

/**
 * The requester view of the IT gov feedback step status
 */
export enum ITGovFeedbackStatus {
  CANT_START = "CANT_START",
  COMPLETED = "COMPLETED",
  IN_REVIEW = "IN_REVIEW",
}

/**
 * The requester view of the IT Gov Final Business Case step status
 */
export enum ITGovFinalBusinessCaseStatus {
  CANT_START = "CANT_START",
  DONE = "DONE",
  EDITS_REQUESTED = "EDITS_REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_NEEDED = "NOT_NEEDED",
  READY = "READY",
  SUBMITTED = "SUBMITTED",
}

/**
 * The requester view of the IT Gov GRB step status
 */
export enum ITGovGRBStatus {
  AWAITING_DECISION = "AWAITING_DECISION",
  AWAITING_GRB_REVIEW = "AWAITING_GRB_REVIEW",
  CANT_START = "CANT_START",
  COMPLETED = "COMPLETED",
  NOT_NEEDED = "NOT_NEEDED",
  READY_TO_SCHEDULE = "READY_TO_SCHEDULE",
  REVIEW_IN_PROGRESS = "REVIEW_IN_PROGRESS",
  SCHEDULED = "SCHEDULED",
}

/**
 * The requester view of the IT Gov GRT step status
 */
export enum ITGovGRTStatus {
  AWAITING_DECISION = "AWAITING_DECISION",
  CANT_START = "CANT_START",
  COMPLETED = "COMPLETED",
  NOT_NEEDED = "NOT_NEEDED",
  READY_TO_SCHEDULE = "READY_TO_SCHEDULE",
  SCHEDULED = "SCHEDULED",
}

/**
 * The requester view of the IT gov intake step status
 */
export enum ITGovIntakeFormStatus {
  COMPLETED = "COMPLETED",
  EDITS_REQUESTED = "EDITS_REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
}

export enum RequestRelationType {
  EXISTING_SERVICE = "EXISTING_SERVICE",
  EXISTING_SYSTEM = "EXISTING_SYSTEM",
  NEW_SYSTEM = "NEW_SYSTEM",
}

/**
 * This represents the possible System Intake Decision States
 */
export enum SystemIntakeDecisionState {
  LCID_ISSUED = "LCID_ISSUED",
  NOT_APPROVED = "NOT_APPROVED",
  NOT_GOVERNANCE = "NOT_GOVERNANCE",
  NO_DECISION = "NO_DECISION",
}

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
 * SystemIntakeStep represents the current step in the intake process
 */
export enum SystemIntakeStep {
  DECISION_AND_NEXT_STEPS = "DECISION_AND_NEXT_STEPS",
  DRAFT_BUSINESS_CASE = "DRAFT_BUSINESS_CASE",
  FINAL_BUSINESS_CASE = "FINAL_BUSINESS_CASE",
  GRB_MEETING = "GRB_MEETING",
  GRT_MEETING = "GRT_MEETING",
  INITIAL_REQUEST_FORM = "INITIAL_REQUEST_FORM",
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
