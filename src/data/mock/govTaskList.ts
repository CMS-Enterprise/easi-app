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
  },

  bizCaseDraftCantStart: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.IN_REVIEW,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z'
    }
  },
  bizCaseDraftSkipped: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.NOT_NEEDED,
        grtMeetingStatus: ITGovGRTStatus.READY_TO_SCHEDULE,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z'
    }
  },
  bizCaseDraftNotStarted: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.READY,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z'
    }
  },
  bizCaseDraftInProgress: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.IN_PROGRESS,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-12T00:30:28Z'
    }
  },
  bizCaseDraftSubmitted: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-13T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-13T00:30:28Z'
    }
  },
  bizCaseDraftEditsRequestedFromAdmins: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.EDITS_REQUESTED,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          id
        }
      ],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-14T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-13T00:30:28Z'
    }
  },
  bizCaseDraftReSubmitted: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          id
        }
      ],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z'
    }
  }
};
