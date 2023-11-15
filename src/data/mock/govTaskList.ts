import {
  GovernanceRequestFeedbackTargetForm,
  ITGovDecisionStatus,
  ITGovDraftBusinessCaseStatus,
  ITGovFeedbackStatus,
  ITGovFinalBusinessCaseStatus,
  ITGovGRBStatus,
  ITGovGRTStatus,
  ITGovIntakeFormStatus,
  SystemIntakeStep
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      governanceRequestFeedbacks: [],
      submittedAt: null,
      updatedAt: null,
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      intakeFormPctComplete: 22,
      governanceRequestFeedbacks: [],
      submittedAt: null,
      updatedAt: null,
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-07T00:30:28Z',
      updatedAt: null,
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          targetForm: GovernanceRequestFeedbackTargetForm.INTAKE_REQUEST,
          id
        }
      ],
      submittedAt: '2023-07-07T00:30:28Z',
      updatedAt: '2023-07-08T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          targetForm: GovernanceRequestFeedbackTargetForm.INTAKE_REQUEST,
          id
        }
      ],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      governanceRequestFeedbacks: [],
      submittedAt: null,
      updatedAt: null,
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      governanceRequestFeedbacks: [],
      submittedAt: null,
      updatedAt: null,
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      governanceRequestFeedbacks: [],
      governanceRequestFeedbackCompletedAt: '2023-07-10T00:30:28Z',
      submittedAt: null,
      updatedAt: null,
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          targetForm: GovernanceRequestFeedbackTargetForm.INTAKE_REQUEST,
          id
        }
      ],
      governanceRequestFeedbackCompletedAt: '2023-07-10T00:30:28Z',
      submittedAt: null,
      updatedAt: null,
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      governanceRequestFeedbacks: [
        {
          __typename: 'GovernanceRequestFeedback',
          targetForm: GovernanceRequestFeedbackTargetForm.INTAKE_REQUEST,
          id
        }
      ],
      submittedAt: null,
      updatedAt: null,
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.GRT_MEETING,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: null
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
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-12T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.SUBMITTED,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-13T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-13T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
      bizCaseDraftUpdatedAt: '2023-07-14T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-13T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseDraftDoneWithFeedback: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
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
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-16T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseDraftDoneNoFeedback: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
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
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-16T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.CANT_START,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.NOT_NEEDED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.DRAFT_BUSINESS_CASE,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.READY_TO_SCHEDULE,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRT_MEETING,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.SCHEDULED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRT_MEETING,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.AWAITING_DECISION,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRT_MEETING,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRT_MEETING,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.AWAITING_DECISION,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRT_MEETING,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
      step: SystemIntakeStep.INITIAL_REQUEST_FORM,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      governanceRequestFeedbackCompletedAt: '2023-07-10T00:30:28Z',
      grtDate: null,
      grbDate: null,
      businessCase: null
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.READY,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.IN_PROGRESS,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      bizCaseFinalPctComplete: 89,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.SUBMITTED,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      bizCaseFinalSubmittedAt: '2023-07-18T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      bizCaseFinalUpdatedAt: '2023-07-19T00:30:28Z',
      bizCaseFinalSubmittedAt: '2023-07-18T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      bizCaseFinalUpdatedAt: '2023-07-20T00:30:28Z',
      bizCaseFinalSubmittedAt: '2023-07-20T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  bizCaseFinalDoneWithFeedback: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
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
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      bizCaseFinalUpdatedAt: '2023-07-2T00:30:28Z',
      bizCaseFinalSubmittedAt: '2023-07-21T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.CANT_START,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      bizCaseFinalUpdatedAt: '2023-07-20T00:30:28Z',
      bizCaseFinalSubmittedAt: '2023-07-21T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },

  grbMeetingCantStart: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
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
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.NOT_NEEDED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.FINAL_BUSINESS_CASE,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.READY_TO_SCHEDULE,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRB_MEETING,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: null,
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.SCHEDULED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRB_MEETING,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-07-20T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
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
        bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.DONE,
        grtMeetingStatus: ITGovGRTStatus.COMPLETED,
        bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.DONE,
        grbMeetingStatus: ITGovGRBStatus.COMPLETED,
        decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START
      },
      step: SystemIntakeStep.GRB_MEETING,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-07-20T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },

  decisionAndNextStepsCantStart: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
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
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-07-20T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  decisionAndNextStepsInProgress: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
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
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-07-20T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  decisionAndNextStepsDone: {
    systemIntake: {
      __typename: 'SystemIntake',
      id,
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
      step: SystemIntakeStep.GRB_MEETING,
      governanceRequestFeedbacks: [],
      submittedAt: '2023-07-09T00:30:28Z',
      updatedAt: '2023-07-09T00:30:28Z',
      bizCaseDraftUpdatedAt: '2023-07-15T00:30:28Z',
      bizCaseDraftSubmittedAt: '2023-07-15T00:30:28Z',
      grtDate: '2023-07-17T00:30:28Z',
      grbDate: '2023-07-20T00:30:28Z',
      decisionAndNextStepsSubmittedAt: '2023-07-21T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  }
};
