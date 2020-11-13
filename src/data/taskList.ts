import { SystemIntakeForm } from 'types/systemIntake';

export const intakeTag = (status: string) => {
  if (status === 'INTAKE_DRAFT') {
    return '';
  }
  return 'COMPLETED';
};

export const initialReviewTag = (intakeStatus: string) => {
  const intakeCompletedStatuses = [
    'NEED_BIZ_CASE',
    'BIZ_CASE_DRAFT',
    'BIZ_CASE_DRAFT_SUBMITTED',
    'BIZ_CASE_CHANGES_NEEDED',
    'BIZ_CASE_FINAL_NEEDED',
    'BIZ_CASE_FINAL_SUBMITTED',
    'READY_FOR_GRB',
    'LCID_ISSUED',
    'NOT_IT_REQUEST'
  ];

  if (intakeStatus === 'INTAKE_SUBMITTED') {
    return '';
  }

  return intakeCompletedStatuses.includes(intakeStatus)
    ? 'COMPLETED'
    : 'CANNOT_START';
};

export const businessCaseTag = (intakeStatus: string) => {
  switch (intakeStatus) {
    case 'INTAKE_DRAFT':
    case 'INTAKE_SUBMITTED':
      return 'CANNOT_START';
    case 'BIZ_CASE_DRAFT_SUBMITTED':
    case 'BIZ_CASE_FINAL_NEEDED':
    case 'BIZ_CASE_FINAL_SUBMITTED':
    case 'LCID_ISSUED':
      return 'COMPLETED';
    case 'NOT_IT_REQUEST':
      return 'NOT_NEEDED';
    default:
      return '';
  }
};

// Task List Item: Attend GRB Meeting
export const attendGrbMeetingTag = (intake: SystemIntakeForm) => {
  if (intake.requestType === 'RECOMPETE') {
    return 'NOT_NEEDED';
  }

  switch (intake.status) {
    case 'READY_FOR_GRB':
      return '';
    case 'LCID_ISSUED':
    case 'WITHDRAWN':
    case 'NOT_IT_REQUEST':
    case 'NOT_APPROVED':
    case 'NOT_GOVERNANCE':
      return 'COMPLETED';
    default:
      return 'CANNOT_START';
  }
};
