import i18next from 'i18next';

import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import {
  closedIntakeStatuses,
  openIntakeStatuses,
  RequestType
} from 'types/systemIntake';

/**
 * Checks whenther an intake is closed
 * @param status - the intake's status
 */
export const isIntakeClosed = (status: string) => {
  return closedIntakeStatuses.includes(status);
};

/**
 * Checks whenther an intake is open
 * @param status - the intake's status
 */
export const isIntakeOpen = (status: string) => {
  return openIntakeStatuses.includes(status);
};

/**
 * Translate the API enum to a human readable string
 */
export const translateRequestType = (requestType: RequestType) => {
  switch (requestType) {
    case 'NEW':
      return i18next.t('intake:requestType.new');
    case 'RECOMPETE':
      return i18next.t('intake:requestType.recompete');
    case 'MAJOR_CHANGES':
      return i18next.t('intake:requestType.majorChanges');
    case 'SHUTDOWN':
      return i18next.t('intake:requestType.shutdown');
    default:
      return '';
  }
};

/**
 * Get the acronym representation of the component name
 * @param componentToTranslate - component name string that needs to be converted to an acronym
 */
export const getAcronymForComponent = (componentToTranslate: string) => {
  const component = cmsDivisionsAndOffices.find(
    c => c.name === componentToTranslate
  );
  if (component) {
    return component.acronym;
  }
  // TODO: what do we return if not found? (should be impossible)
  return 'Other';
};
