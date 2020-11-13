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

export const businessCaseTag = (intake: SystemIntakeForm) => {
  if (intake.requestType === 'RECOMPETE') {
    return 'CANNOT_START';
  }

  switch (intake.status) {
    case 'INTAKE_DRAFT':
    case 'INTAKE_SUBMITTED':
      return 'CANNOT_START';
    case 'BIZ_CASE_DRAFT_SUBMITTED':
    case 'BIZ_CASE_FINAL_NEEDED':
    case 'BIZ_CASE_FINAL_SUBMITTED':
      return 'COMPLETED';
    case 'NOT_IT_REQUEST':
    case 'LCID_ISSUED':
      return 'NOT_NEEDED';
    default:
      return '';
  }
};

export const finalBusinessCaseTag = (intakeStatus: string) => {
  switch (intakeStatus) {
    case 'INTAKE_DRAFT':
    case 'INTAKE_SUBMITTED':
    case 'NEED_BIZ_CASE':
    case 'BIZ_CASE_DRAFT':
    case 'BIZ_CASE_DRAFT_SUBMITTED':
      return 'CANNOT_START';
    case 'BIZ_CASE_FINAL_SUBMITTED':
    case 'READY_FOR_GRT':
    case 'READY_FOR_GRB':
      return 'COMPLETED';
    case 'NOT_IT_REQUEST':
    case 'WITHDRAWN':
    case 'LCID_ISSUED':
      return 'NOT_NEEDED';
    default:
      return '';
  }
};
