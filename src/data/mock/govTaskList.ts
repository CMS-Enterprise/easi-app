import {
  ITGovDecisionStatus,
  ITGovDraftBusinessCaseStatus,
  ITGovFeedbackStatus,
  ITGovFinalBusinessCaseStatus,
  ITGovGRBStatus,
  ITGovGRTStatus,
  ITGovIntakeFormStatus
} from 'types/graphql-global-types';
import { GetGovernanceTaskListWithMockData } from 'types/itGov';

const id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

/** IT Gov Task List status states */
// eslint-disable-next-line import/prefer-default-export
export const taskListState: {
  [k: string]: GetGovernanceTaskListWithMockData;
} = {
  /** Event: Intake Request form: Requester starts a new request */
  intakeFormNotStarted: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.READY,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: null,
      updatedAt: null
    }
  },
  /** Event: Intake Request form: Requester starts Intake Request form */
  intakeFormInProgress: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.IN_PROGRESS,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: null,
      updatedAt: null
    }
  },
  /** Event: Intake Request form: Requester submits Intake Request form */
  intakeFormSubmitted: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.IN_REVIEW,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-07T00:30:28Z',
      updatedAt: null
    }
  },
  /** Event: Intake Request form: Admin takes the action to request edits to the Intake Request form */
  intakeFormEditsRequested: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.EDITS_REQUESTED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      },
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          id
        }
      ],
      submittedAt: '2023-07-07T00:30:28Z',
      updatedAt: '2023-07-08T00:30:28Z'
    }
  },
  /** Event: Intake Request form: Requester re- submits Intake Request form */
  intakeFormResubmittedAfterEdits: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.IN_REVIEW,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      },
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          id
        }
      ],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z'
    }
  },

  feedbackFromInitialReviewCantStart: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.IN_PROGRESS,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: null,
      updatedAt: null
    }
  },
  feedbackFromInitialReviewInProgress: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.IN_REVIEW,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: null,
      updatedAt: null
    }
  },
  feedbackFromInitialReviewDoneNoFeedback: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      governanceRequestFeedbackCompletedAt: '2023-07-10T00:30:28Z',
      submittedAt: null,
      updatedAt: null
    }
  },
  feedbackFromInitialReviewDoneWithFeedback: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      },
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          id
        }
      ],
      governanceRequestFeedbackCompletedAt: '2023-07-10T00:30:28Z',
      submittedAt: null,
      updatedAt: null
    }
  },
  feedbackFromInitialReviewResubmittedWithFeedback: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.IN_REVIEW,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      },
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          id
        }
      ],
      submittedAt: null,
      updatedAt: null
    }
  }
};
