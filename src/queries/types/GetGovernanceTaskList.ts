/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ITGovIntakeFormStatus, ITGovFeedbackStatus, ITGovDecisionStatus, ITGovDraftBusinessCaseStatus, ITGovGRTStatus, ITGovFinalBusinessCaseStatus, ITGovGRBStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetGovernanceTaskList
// ====================================================

export interface GetGovernanceTaskList_systemIntake_itGovTaskStatuses {
  __typename: "ITGovTaskStatuses";
  intakeFormStatus: ITGovIntakeFormStatus;
  feedbackFromInitialReviewStatus: ITGovFeedbackStatus;
  decisionAndNextStepsStatus: ITGovDecisionStatus;
  bizCaseDraftStatus: ITGovDraftBusinessCaseStatus;
  grtMeetingStatus: ITGovGRTStatus;
  bizCaseFinalStatus: ITGovFinalBusinessCaseStatus;
  grbMeetingStatus: ITGovGRBStatus;
}

export interface GetGovernanceTaskList_systemIntake_governanceRequestFeedbacks {
  __typename: "GovernanceRequestFeedback";
  id: UUID;
}

export interface GetGovernanceTaskList_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  itGovTaskStatuses: GetGovernanceTaskList_systemIntake_itGovTaskStatuses;
  governanceRequestFeedbacks: GetGovernanceTaskList_systemIntake_governanceRequestFeedbacks[];
  submittedAt: Time | null;
  updatedAt: Time | null;
}

export interface GetGovernanceTaskList {
  systemIntake: GetGovernanceTaskList_systemIntake | null;
}

export interface GetGovernanceTaskListVariables {
  id: UUID;
}
