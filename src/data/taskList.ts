import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';

type TagEnum = 'COMPLETED' | 'CANNOT_START' | 'NOT_NEEDED' | '';

export const intakeTag = (status: string): TagEnum => {
  if (status === 'INTAKE_DRAFT') {
    return '';
  }
  return 'COMPLETED';
};

export const initialReviewTag = (intakeStatus: string): TagEnum => {
  const intakeCompletedStatuses = [
    'NEED_BIZ_CASE',
    'BIZ_CASE_DRAFT',
    'BIZ_CASE_DRAFT_SUBMITTED',
    'BIZ_CASE_CHANGES_NEEDED',
    'BIZ_CASE_FINAL_NEEDED',
    'BIZ_CASE_FINAL_SUBMITTED',
    'READY_FOR_GRB',
    'READY_FOR_GRT',
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

export const businessCaseTag = (intake: SystemIntake): TagEnum => {
  if (intake.requestType === 'RECOMPETE') {
    if (intake.status === 'LCID_ISSUED') {
      return 'NOT_NEEDED';
    }
    return 'CANNOT_START';
  }

  switch (intake.status) {
    case 'INTAKE_DRAFT':
    case 'INTAKE_SUBMITTED':
      return 'CANNOT_START';
    case 'BIZ_CASE_DRAFT_SUBMITTED':
    case 'BIZ_CASE_FINAL_NEEDED':
    case 'BIZ_CASE_FINAL_SUBMITTED':
    case 'READY_FOR_GRB':
    case 'LCID_ISSUED':
      return 'COMPLETED';
    case 'NOT_IT_REQUEST':
      return 'NOT_NEEDED';
    default:
      return '';
  }
};

export const finalBusinessCaseTag = (intake: SystemIntake) => {
  if (intake.requestType === 'RECOMPETE') {
    if (intake.status === 'LCID_ISSUED') {
      return 'NOT_NEEDED';
    }
    return 'CANNOT_START';
  }

  switch (intake.status) {
    case 'INTAKE_DRAFT':
    case 'INTAKE_SUBMITTED':
    case 'NEED_BIZ_CASE':
    case 'BIZ_CASE_DRAFT':
    case 'BIZ_CASE_DRAFT_SUBMITTED':
    case 'BIZ_CASE_CHANGES_NEEDED':
    case 'READY_FOR_GRT':
      return 'CANNOT_START';
    case 'BIZ_CASE_FINAL_SUBMITTED':
    case 'READY_FOR_GRB':
    case 'LCID_ISSUED':
      return 'COMPLETED';
    case 'NOT_IT_REQUEST':
    case 'WITHDRAWN':
      return 'NOT_NEEDED';
    default:
      return '';
  }
};

// Task List Item: Attend GRB Meeting
export const attendGrbMeetingTag = (intake: SystemIntake): TagEnum => {
  if (intake.requestType === 'RECOMPETE') {
    if (intake.status === 'LCID_ISSUED') {
      return 'NOT_NEEDED';
    }
    return 'CANNOT_START';
  }

  switch (intake.status) {
    case 'READY_FOR_GRB':
      return '';
    case 'LCID_ISSUED':
    case 'WITHDRAWN':
    case 'NOT_IT_REQUEST':
    case 'NOT_APPROVED':
    case 'NO_GOVERNANCE':
      return 'COMPLETED';
    default:
      return 'CANNOT_START';
  }
};

// Task List Item: Decision
export const decisionTag = (intake: SystemIntake): TagEnum => {
  if (intake.requestType === 'RECOMPETE') {
    if (intake.status === 'LCID_ISSUED') {
      return '';
    }
    return 'CANNOT_START';
  }

  switch (intake.status) {
    case 'LCID_ISSUED':
    case 'NOT_APPROVED':
    case 'NOT_IT_REQUEST':
    case 'NO_GOVERNANCE':
      return '';
    default:
      return 'CANNOT_START';
  }
};
