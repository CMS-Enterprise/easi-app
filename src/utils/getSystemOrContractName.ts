import { SystemIntake_systems as System } from 'gql/legacyGQL/types/SystemIntake';
import i18next from 'i18next';

import { RequestRelationType } from 'types/graphql-global-types';

/** Returns linked contract or system name for display */
const getSystemOrContractName = (
  relationType: RequestRelationType | null,
  contractName: string | null,
  systems: System[]
) => {
  if (relationType === RequestRelationType.EXISTING_SERVICE && contractName) {
    return contractName;
  }

  if (relationType === RequestRelationType.EXISTING_SYSTEM) {
    if (systems.length === 1) {
      return systems[0].name;
    }

    // If more than one system, returns `[name], +[count]`
    return i18next.t('governanceReviewTeam:systemNamePlural', {
      name: systems[0].name,
      count: systems.length - 1
    });
  }

  return i18next.t('governanceReviewTeam:noneSpecified');
};

export default getSystemOrContractName;
