import {
  ITGovDecisionStatus,
  ITGovDraftBusinessCaseStatus,
  ITGovFeedbackStatus,
  ITGovFinalBusinessCaseStatus,
  ITGovGRBStatus,
  ITGovGRTStatus,
  ITGovIntakeFormStatus
} from 'types/graphql-global-types';
import { ItGovTaskStatuses } from 'types/itGov';

// IT Gov Task List status states

// Fill out the Intake Request form

// Event: Requester starts a new request
export const intakeFormNotStarted: ItGovTaskStatuses = {
  intakeFormStatus: ITGovIntakeFormStatus.READY,
  feedbackFromInitialReviewStatus: ITGovFeedbackStatus.CANT_START,
  decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
  bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
  grtMeetingStatus: ITGovGRTStatus.CANT_START,
  bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
  grbMeetingStatus: ITGovGRBStatus.CANT_START,
  __typename: 'ITGovTaskStatuses'
};

// Event: Requester starts Intake Request form
export const intakeFormInProgress: ItGovTaskStatuses = {
  intakeFormStatus: ITGovIntakeFormStatus.IN_PROGRESS,
  feedbackFromInitialReviewStatus: ITGovFeedbackStatus.CANT_START,
  decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
  bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
  grtMeetingStatus: ITGovGRTStatus.CANT_START,
  bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
  grbMeetingStatus: ITGovGRBStatus.CANT_START,
  __typename: 'ITGovTaskStatuses'
};

// Event: Requester submits Intake Request form
export const intakeFormSubmitted: ItGovTaskStatuses = {
  intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
  feedbackFromInitialReviewStatus: ITGovFeedbackStatus.IN_REVIEW,
  decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
  bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
  grtMeetingStatus: ITGovGRTStatus.CANT_START,
  bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
  grbMeetingStatus: ITGovGRBStatus.CANT_START,
  __typename: 'ITGovTaskStatuses'
};

// Event: Admin takes the action to request edits to the Intake Request form
export const intakeFormEditsRequested: ItGovTaskStatuses = {
  intakeFormStatus: ITGovIntakeFormStatus.EDITS_REQUESTED,
  feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
  decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
  bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
  grtMeetingStatus: ITGovGRTStatus.CANT_START,
  bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
  grbMeetingStatus: ITGovGRBStatus.CANT_START,
  __typename: 'ITGovTaskStatuses'
};

// Event: Requester re- submits Intake Request form
export const intakeFormResubmittedAfterEdits: ItGovTaskStatuses = {
  intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
  feedbackFromInitialReviewStatus: ITGovFeedbackStatus.IN_REVIEW,
  decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
  bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
  grtMeetingStatus: ITGovGRTStatus.CANT_START,
  bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
  grbMeetingStatus: ITGovGRBStatus.CANT_START,
  __typename: 'ITGovTaskStatuses'
};
