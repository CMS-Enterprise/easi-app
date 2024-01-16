import i18next from 'i18next';

import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import { RequestType } from 'types/systemIntake';

/**
 * Checks whether an intake has a "decision"
 * @param status - the intake's status
 */
export const intakeHasDecision = (status: string) => {
  return [
    'NO_GOVERNANCE',
    'NOT_IT_REQUEST',
    'LCID_ISSUED',
    'NOT_APPROVED'
  ].includes(status || '');
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

  // TODO: what do we return if not found? (should be impossible)
  return component ? component.acronym : 'Other';
};
