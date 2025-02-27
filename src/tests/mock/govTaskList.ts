import {
  GovernanceRequestFeedbackTargetForm,
  ITGovDecisionStatus,
  ITGovDraftBusinessCaseStatus,
  ITGovFeedbackStatus,
  ITGovFinalBusinessCaseStatus,
  ITGovGRBStatus,
  ITGovGRTStatus,
  ITGovIntakeFormStatus,
  SystemIntakeDecisionState,
  SystemIntakeStep
} from 'gql/generated/graphql';

import { SystemIntakeState } from 'types/graphql-global-types';
import { GetGovernanceTaskListWithMockData } from 'types/itGov';

import { taskListSystemIntake } from './systemIntake';

const { id } = taskListSystemIntake;

/** IT Gov Task List status states */
// eslint-disable-next-line import/prefer-default-export
export const taskListState: {
  [k: string]: GetGovernanceTaskListWithMockData;
} = {
  intakeFormNotStarted: {
    systemIntake: taskListSystemIntake
  },
  intakeFormInProgress: {
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
  grbMeetingSkipped: {
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
      }
    }
  },
  grbMeetingInProgressNotScheduled: {
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
      }
    }
  },
  grbMeetingInProgressScheduled: {
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
      }
    }
  },
  grbMeetingDone: {
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

  decisionAndNextStepsCantStart: {
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
      grbDate: '2023-07-20T00:30:28Z',
      businessCase: {
        __typename: 'BusinessCase',
        id: '1a4baff0-12ba-4087-8483-678d92b48733'
      }
    }
  },
  decisionAndNextStepsDone: {
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
