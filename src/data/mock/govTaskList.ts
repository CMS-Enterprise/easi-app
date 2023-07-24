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
      updatedAt: null,
      grtDate: null,
      grbDate: null
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
      intakeFormPctComplete: 22,
      governanceRequestFeedbacks: [],
      submittedAt: null,
      updatedAt: null,
      grtDate: null,
      grbDate: null
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
      updatedAt: null,
      grtDate: null,
      grbDate: null
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
      updatedAt: '2023-07-08T00:30:28Z',
      grtDate: null,
      grbDate: null
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
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: null,
      grbDate: null
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
      updatedAt: null,
      grtDate: null,
      grbDate: null
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
      updatedAt: null,
      grtDate: null,
      grbDate: null
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
      updatedAt: null,
      grtDate: null,
      grbDate: null
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
      updatedAt: null,
      grtDate: null,
      grbDate: null
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
      updatedAt: null,
      grtDate: null,
      grbDate: null
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
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: null,
      grbDate: null
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
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: null,
      grbDate: null
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
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: null,
      grbDate: null
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
      bizCaseDraftUpdatedAt: '2023-07-12T00:30:28Z',
      grtDate: null,
      grbDate: null
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
      bizCaseDraftSubmittedAt: '2023-07-13T00:30:28Z',
      grtDate: null,
      grbDate: null
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
      bizCaseDraftSubmittedAt: '2023-07-13T00:30:28Z',
      grtDate: null,
      grbDate: null
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
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: null,
      grbDate: null
    }
  },

  grtMeetingCantStart: {
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
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: null,
      grbDate: null
    }
  },
  grtMeetingSkipped: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.NOT_NEEDED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: null,
      grbDate: null
    }
  },
  grtMeetingInProgressNotScheduled: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.READY_TO_SCHEDULE,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: null,
      grbDate: null
    }
  },
  grtMeetingInProgressScheduled: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.SCHEDULED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null
    }
  },
  grtMeetingDone: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.AWAITING_DECISION,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null
    }
  },
  grtMeetingDoneDecisionWithFeedback: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
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
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null
    }
  },
  grtMeetingDoneDecisionWithoutFeedback: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null
    }
  },

  bizCaseFinalCantStart: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.AWAITING_DECISION,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null
    }
  },
  bizCaseFinalSkipped: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.NOT_NEEDED,
        grtMeetingStatus: ITGovGRTStatus.NOT_NEEDED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.NOT_NEEDED,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      governanceRequestFeedbackCompletedAt: '2023-07-10T00:30:28Z',
      grtDate: null,
      grbDate: null
    }
  },
  bizCaseFinalNotStarted: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.READY,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null
    }
  },
  bizCaseFinalInProgress: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.IN_PROGRESS,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      bizCaseFinalPctComplete: 89
    }
  },
  bizCaseFinalSubmitted: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.COMPLETED,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      bizCaseFinalSubmittedAt: '2023-07-18T00:30:28Z'
    }
  },
  bizCaseFinalEditsRequestedFromAdmins: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.EDITS_REQUESTED,
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
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      bizCaseFinalUpdatedAt: '2023-07-19T00:30:28Z',
      bizCaseFinalSubmittedAt: '2023-07-18T00:30:28Z'
    }
  },
  bizCaseFinalReSubmitted: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.COMPLETED,
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
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      bizCaseFinalUpdatedAt: '2023-07-20T00:30:28Z',
      bizCaseFinalSubmittedAt: '2023-07-20T00:30:28Z'
    }
  },
  /*
  bizCaseFinalDoneWithFeedback: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.COMPLETED, // DONE
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
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      bizCaseFinalUpdatedAt: '2023-07-20T00:30:28Z',
      bizCaseFinalSubmittedAt: '2023-07-20T00:30:28Z'
    }
  },
  bizCaseFinalDoneNoFeedback: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.COMPLETED, // DONE
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      bizCaseFinalUpdatedAt: '2023-07-20T00:30:28Z',
      bizCaseFinalSubmittedAt: '2023-07-20T00:30:28Z'
    }
  }
  */

  grbMeetingCantStart: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.COMPLETED,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null
    }
  },
  grbMeetingSkipped: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.COMPLETED,
        grbMeetingStatus: ITGovGRBStatus.NOT_NEEDED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null
    }
  },
  grbMeetingInProgressNotScheduled: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.COMPLETED,
        grbMeetingStatus: ITGovGRBStatus.READY_TO_SCHEDULE,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null
    }
  },
  grbMeetingInProgressScheduled: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.COMPLETED,
        grbMeetingStatus: ITGovGRBStatus.SCHEDULED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-07-20T00:30:28Z'
    }
  },
  grbMeetingDone: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.COMPLETED,
        grbMeetingStatus: ITGovGRBStatus.COMPLETED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-07-20T00:30:28Z'
    }
  }
  /*
  bizCaseFinalDoneWithFeedback: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.COMPLETED, // DONE
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
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      bizCaseFinalUpdatedAt: '2023-07-20T00:30:28Z',
      bizCaseFinalSubmittedAt: '2023-07-20T00:30:28Z'
    }
  },
  bizCaseFinalDoneNoFeedback: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.COMPLETED,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.COMPLETED, // DONE
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      bizCaseFinalUpdatedAt: '2023-07-20T00:30:28Z',
      bizCaseFinalSubmittedAt: '2023-07-20T00:30:28Z'
    }
  }
  */
};
