/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ITGovIntakeFormStatus, ITGovFeedbackStatus, ITGovDraftBusinessCaseStatus, ITGovGRTStatus, ITGovFinalBusinessCaseStatus, ITGovGRBStatus, ITGovDecisionStatus, GovernanceRequestFeedbackTargetForm, SystemIntakeStep, SystemIntakeState, SystemIntakeDecisionState } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetGovernanceTaskList
// ====================================================

export interface GetGovernanceTaskList_systemIntake_itGovTaskStatuses {
  __typename: "ITGovTaskStatuses";
  intakeFormStatus: ITGovIntakeFormStatus;
  feedbackFromInitialReviewStatus: ITGovFeedbackStatus;
  bizCaseDraftStatus: ITGovDraftBusinessCaseStatus;
  grtMeetingStatus: ITGovGRTStatus;
  bizCaseFinalStatus: ITGovFinalBusinessCaseStatus;
  grbMeetingStatus: ITGovGRBStatus;
  decisionAndNextStepsStatus: ITGovDecisionStatus;
}

export interface GetGovernanceTaskList_systemIntake_governanceRequestFeedbacks {
  __typename: "GovernanceRequestFeedback";
  id: UUID;
  targetForm: GovernanceRequestFeedbackTargetForm;
}

export interface GetGovernanceTaskList_systemIntake_businessCase {
  __typename: "BusinessCase";
  id: UUID;
}

export interface GetGovernanceTaskList_systemIntake {
  __typename: "SystemIntake";
  id: UUID;
  requestName: string | null;
  itGovTaskStatuses: GetGovernanceTaskList_systemIntake_itGovTaskStatuses;
  governanceRequestFeedbacks: GetGovernanceTaskList_systemIntake_governanceRequestFeedbacks[];
  submittedAt: Time | null;
  updatedAt: Time | null;
  grtDate: Time | null;
  grbDate: Time | null;
  step: SystemIntakeStep;
  state: SystemIntakeState;
  decisionState: SystemIntakeDecisionState;
  businessCase: GetGovernanceTaskList_systemIntake_businessCase | null;
}

export interface GetGovernanceTaskList {
  systemIntake: GetGovernanceTaskList_systemIntake | null;
}

export interface GetGovernanceTaskListVariables {
  id: UUID;
}
