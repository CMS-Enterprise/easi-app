/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ITGovIntakeStatus, ITGovFeedbackStatus, ITGovDecisionStatus, ITGovDraftBuisnessCaseStatus, ITGovGRTStatus, ITGovFinalBuisnessCaseStatus, ITGovGRBStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetGovernanceTaskList
// ====================================================

export interface GetGovernanceTaskList_systemIntake_itGovTaskStatuses {
  __typename: "ITGovTaskStatuses";
  intakeFormStatus: ITGovIntakeStatus;
  feedbackFromInitialReviewStatus: ITGovFeedbackStatus;
  decisionAndNextStepsStatus: ITGovDecisionStatus;
  bizCaseDraftStatus: ITGovDraftBuisnessCaseStatus;
  grtMeetingStatus: ITGovGRTStatus;
  bizCaseFinalStatus: ITGovFinalBuisnessCaseStatus;
  grbMeetingStatus: ITGovGRBStatus;
}

export interface GetGovernanceTaskList_systemIntake {
  __typename: "SystemIntake";
  itGovTaskStatuses: GetGovernanceTaskList_systemIntake_itGovTaskStatuses;
}

export interface GetGovernanceTaskList {
  systemIntake: GetGovernanceTaskList_systemIntake | null;
}

export interface GetGovernanceTaskListVariables {
  id: UUID;
}
