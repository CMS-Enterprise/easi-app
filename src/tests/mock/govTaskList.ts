import {
  GetGovernanceTaskListQuery,
  GovernanceRequestFeedbackTargetForm,
  ITGovDecisionStatus,
  ITGovDraftBusinessCaseStatus,
  ITGovFeedbackStatus,
  ITGovFinalBusinessCaseStatus,
  ITGovGRBStatus,
  ITGovGRTStatus,
  ITGovIntakeFormStatus,
  SystemIntakeDecisionState,
  SystemIntakeGRBReviewType,
  SystemIntakeState,
  SystemIntakeStep
} from 'gql/generated/graphql';

import { taskListSystemIntake } from './systemIntake';

const { id } = taskListSystemIntake;

/** IT Gov Task List status states */
// eslint-disable-next-line import/prefer-default-export
export const taskListState: {
  [k: string]: GetGovernanceTaskListQuery;
} = {
  intakeFormNotStarted: {
    systemIntake: taskListSystemIntake,
    __typename: 'Query'
  },
  intakeFormInProgress: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.IN_PROGRESS,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      }
    }
  },
  intakeFormSubmitted: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
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
      submittedAt: '2023-07-07T00:30:28Z'
    }
  },
  intakeFormEditsRequested: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
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
          targetForm: GovernanceRequestFeedbackTargetForm.INTAKE_REQUEST,
          id
        }
      ],
      submittedAt: '2023-07-07T00:30:28Z',
      updatedAt: '2023-07-08T00:30:28Z'
    }
  },
  intakeFormResubmittedAfterEdits: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
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
          targetForm: GovernanceRequestFeedbackTargetForm.INTAKE_REQUEST,
          id
        }
      ],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z'
    }
  },

  feedbackFromInitialReviewCantStart: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.IN_PROGRESS,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      }
    }
  },
  feedbackFromInitialReviewInProgress: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.IN_REVIEW,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      }
    }
  },
  feedbackFromInitialReviewDoneNoFeedback: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START
      }
    }
  },
  feedbackFromInitialReviewDoneWithFeedback: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
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
          targetForm: GovernanceRequestFeedbackTargetForm.INTAKE_REQUEST,
          id
        }
      ]
    }
  },
  feedbackFromInitialReviewResubmittedWithFeedback: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
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
          targetForm: GovernanceRequestFeedbackTargetForm.INTAKE_REQUEST,
          id
        }
      ]
    }
  },

  bizCaseDraftCantStart: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
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
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z'
    }
  },
  bizCaseDraftSkipped: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
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
      step: SystemIntakeStep.GRT_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z'
    }
  },
  bizCaseDraftNotStarted: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
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
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z'
    }
  },
  bizCaseDraftInProgress: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
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
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseDraftSubmitted: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.SUBMITTED,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseDraftEditsRequestedFromAdmins: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
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
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          targetForm: GovernanceRequestFeedbackTargetForm.DRAFT_BUSINESS_CASE,
          id
        }
      ],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseDraftReSubmitted: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.SUBMITTED,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          targetForm: GovernanceRequestFeedbackTargetForm.DRAFT_BUSINESS_CASE,
          id
        }
      ],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseDraftDoneWithFeedback: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          targetForm: GovernanceRequestFeedbackTargetForm.DRAFT_BUSINESS_CASE,
          id
        }
      ],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseDraftDoneNoFeedback: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },

  grtMeetingCantStart: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  grtMeetingSkipped: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.NOT_NEEDED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  grtMeetingInProgressNotScheduled: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.READY_TO_SCHEDULE,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRT_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  grtMeetingInProgressScheduled: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.SCHEDULED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRT_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  grtMeetingDone: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.AWAITING_DECISION,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRT_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  grtMeetingDoneDecisionWithFeedback: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRT_MEETING,
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          targetForm: GovernanceRequestFeedbackTargetForm.DRAFT_BUSINESS_CASE,
          id
        }
      ],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  grtMeetingDoneDecisionWithoutFeedback: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRT_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },

  bizCaseFinalCantStart: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.AWAITING_DECISION,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRT_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseFinalSkipped: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: null,
      businessCase: null
    }
  },
  bizCaseFinalNotStarted: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.READY,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseFinalInProgress: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.IN_PROGRESS,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseFinalSubmitted: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.SUBMITTED,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseFinalEditsRequestedFromAdmins: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.EDITS_REQUESTED,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          targetForm: GovernanceRequestFeedbackTargetForm.FINAL_BUSINESS_CASE,
          id
        }
      ],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseFinalReSubmitted: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.SUBMITTED,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          targetForm: GovernanceRequestFeedbackTargetForm.FINAL_BUSINESS_CASE,
          id
        }
      ],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseFinalDoneWithFeedback: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          targetForm: GovernanceRequestFeedbackTargetForm.FINAL_BUSINESS_CASE,
          id
        }
      ],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseFinalDoneNoFeedback: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },

  grbMeetingCantStart: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      },
      grbReviewType: SystemIntakeGRBReviewType.STANDARD
    }
  },
  grbMeetingSkipped: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.NOT_NEEDED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      },
      grbReviewType: SystemIntakeGRBReviewType.STANDARD
    }
  },
  grbMeetingInProgressNotScheduled: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.READY_TO_SCHEDULE,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRB_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      },
      grbReviewType: SystemIntakeGRBReviewType.STANDARD
    }
  },
  grbMeetingInProgressScheduled: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.SCHEDULED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRB_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-07-20T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      },
      grbReviewType: SystemIntakeGRBReviewType.STANDARD,
      grbReviewStartedAt: '2023-07-20T00:30:28Z',
      grbReviewAsyncRecordingTime: '2023-07-20T00:30:28Z',
      grbReviewAsyncEndDate: '2023-07-20T00:30:28Z',
      grbReviewAsyncManualEndDate: null
    }
  },
  grbMeetingInProgressAwaitingGrbReview: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.AWAITING_GRB_REVIEW,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRB_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      },
      grbReviewType: SystemIntakeGRBReviewType.ASYNC,
      grbReviewStartedAt: null,
      grbReviewAsyncRecordingTime: '2023-06-02T00:30:28Z',
      grbReviewAsyncEndDate: null,
      grbReviewAsyncManualEndDate: null
    }
  },
  grbMeetingReviewInProgress: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.REVIEW_IN_PROGRESS,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRB_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      },
      grbReviewType: SystemIntakeGRBReviewType.ASYNC,
      grbReviewStartedAt: '2023-06-02T00:30:28Z',
      grbReviewAsyncRecordingTime: null,
      grbReviewAsyncEndDate: '2023-07-20T00:30:28Z',
      grbReviewAsyncManualEndDate: null
    }
  },
  grbMeetingAwaitingDecision: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.AWAITING_DECISION,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRB_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-07-20T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      },
      grbReviewType: SystemIntakeGRBReviewType.STANDARD,
      grbReviewStartedAt: '2023-07-20T00:30:28Z',
      grbReviewAsyncRecordingTime: '2023-07-20T00:30:28Z',
      grbReviewAsyncEndDate: '2023-07-20T00:30:28Z',
      grbReviewAsyncManualEndDate: null
    }
  },
  grbMeetingDone: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.COMPLETED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRB_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-07-20T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      },
      grbReviewType: SystemIntakeGRBReviewType.STANDARD,
      grbReviewStartedAt: '2023-07-20T00:30:28Z',
      grbReviewAsyncRecordingTime: '2023-07-20T00:30:28Z',
      grbReviewAsyncEndDate: '2023-07-20T00:30:28Z',
      grbReviewAsyncManualEndDate: null
    }
  },

  decisionAndNextStepsCantStart: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.COMPLETED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRB_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-07-20T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  decisionAndNextStepsInProgress: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.COMPLETED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.IN_REVIEW
      },
      step: SystemIntakeStep.DECISION_AND_NEXT_STEPS,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-08-02T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      },
      grbReviewType: SystemIntakeGRBReviewType.STANDARD,
      grbReviewStartedAt: '2023-07-20T00:30:28Z',
      grbReviewAsyncRecordingTime: null,
      grbReviewAsyncEndDate: '2023-08-02T00:30:28Z',
      grbReviewAsyncManualEndDate: null
    }
  },
  decisionAndNextStepsDone: {
    __typename: 'Query',
    systemIntake: {
      ...taskListSystemIntake,
      itGovTaskStatuses: {
        __typename: 'ITGovTaskStatuses',
        intakeFormStatus: ITGovIntakeFormStatus.COMPLETED,
        feedbackFromInitialReviewStatus: ITGovFeedbackStatus.COMPLETED,
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.COMPLETED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.COMPLETED
      },
      decisionState: SystemIntakeDecisionState.LCID_ISSUED,
      state: SystemIntakeState.CLOSED,
      step: SystemIntakeStep.GRB_MEETING,
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-07-20T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  }
};
