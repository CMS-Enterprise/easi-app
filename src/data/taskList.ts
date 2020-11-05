import { businessCaseInitialData } from 'data/businessCase';
import { BusinessCaseModel } from 'types/businessCase';
import { SystemIntakeForm } from 'types/systemIntake';

export const intakeStatusFromIntake = (intake: SystemIntakeForm) => {
  if (intake.id === '') {
    return 'START';
  }
  if (intake.status === 'INTAKE_DRAFT') {
    return 'CONTINUE';
  }
  return 'COMPLETED';
};

export const chooseIntakePath = (intake: SystemIntakeForm, status: string) => {
  let link: string;
  switch (status) {
    case 'CONTINUE':
      link = `/system/${intake.id}/contact-details`;
      break;
    case 'COMPLETED':
      // This will need to be changed once we have an intake review page
      link = '/';
      break;
    default:
      link = '/system/new';
  }
  return link;
};

export const feedbackStatusFromIntakeStatus = (intakeStatus: string) => {
  switch (intakeStatus) {
    case 'INTAKE_SUBMITTED':
      return 'SUBMITTED';
    case 'NEED_BIZ_CASE':
    case 'LCID_ISSUED':
    case 'NOT_IT_REQUEST':
      return 'COMPLETED';
    default:
      return 'CANNOT_START';
  }
};

export const bizCaseStatus = (
  intakeStatus: string,
  businessCase: BusinessCaseModel
  // eslint-disable-next-line consistent-return
) => {
  // This is for our NEW and CURRENT intake statuses
  // until all the old ones are deprecated
  switch (intakeStatus) {
    case 'BIZ_CASE_DRAFT':
    case 'BIZ_CASE_DRAFT_SUBMITTED':
      return intakeStatus;
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
    default:
      return 'CANNOT_START';
  }
  // END: Delete this when old statuses are deprecated
};
