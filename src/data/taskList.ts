import { businessCaseInitialData } from 'data/businessCase';
import { BusinessCaseModel } from 'types/businessCase';
import { SystemIntakeForm } from 'types/systemIntake';

// TODO: REFACTOR
export const intakeStatusFromIntake = (intake: SystemIntakeForm) => {
  if (intake.id === '') {
    return 'START';
  }
  if (intake.status === 'INTAKE_DRAFT') {
    return 'CONTINUE';
  }
  return 'COMPLETED';
};

// TODO: REFACTOR
export const feedbackStatusFromIntakeStatus = (intakeStatus: string) => {
  switch (intakeStatus) {
    case 'INTAKE_SUBMITTED':
      return 'SUBMITTED';
    case 'NEED_BIZ_CASE':
    case 'BIZ_CASE_DRAFT':
    case 'BIZ_CASE_DRAFT_SUBMITTED':
    case 'LCID_ISSUED':
    case 'NOT_IT_REQUEST':
      return 'COMPLETED';
    default:
      return 'CANNOT_START';
  }
};

// TODO: REFACTOR
export const bizCaseStatus = (
  intakeStatus: string,
  businessCase: BusinessCaseModel
  // eslint-disable-next-line consistent-return
) => {
  // This is for our NEW and CURRENT intake statuses
  // until all the old ones are deprecated
  switch (intakeStatus) {
    case 'BIZ_CASE_DRAFT_SUBMITTED':
      return 'BIZ_CASE_DRAFT_SUBMITTED';
    case 'BIZ_CASE_CHANGES_NEEDED':
      return 'BIZ_CASE_CHANGES_NEEDED';
    default:
      break;
  }

  // START: Delete this when old statuses are deprecated
  if (businessCase === businessCaseInitialData) {
    switch (intakeStatus) {
      case 'NEED_BIZ_CASE':
        return 'START';
      case 'LCID_ISSUED':
      case 'NOT_IT_REQUEST':
        return 'NOT_NEEDED';
      default:
        return 'CANNOT_START';
    }
  }
  switch (businessCase.status) {
    case 'DRAFT':
      return 'CONTINUE';
    case 'SUBMITTED':
      return 'COMPLETED';
    default:
      return 'CANNOT_START';
  }
  // END: Delete this when old statuses are deprecated
};
