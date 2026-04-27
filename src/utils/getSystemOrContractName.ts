import {
  GetTRBRequestSummaryQuery,
  RequestRelationType
} from 'gql/generated/graphql';
import i18next from 'i18next';

/** Returns linked contract or system name for display */
const getSystemOrContractName = (
  relationType: RequestRelationType | null | undefined,
  contractName: string | null | undefined,
  systems: GetTRBRequestSummaryQuery['trbRequest']['systems']
) => {
  if (relationType === RequestRelationType.EXISTING_SERVICE && contractName) {
    return contractName;
  }

  if (relationType === RequestRelationType.EXISTING_SYSTEM) {
    const systemNames = systems
      .map(system => system?.name)
      .filter((name): name is string => Boolean(name));

    if (systemNames.length === 0) {
      return i18next.t('governanceReviewTeam:noneSpecified');
    }

    if (systemNames.length === 1) {
      return systemNames[0];
    }

    // If more than one system, returns `[name], +[count]`
    return i18next.t('governanceReviewTeam:systemNamePlural', {
      name: systemNames[0],
      count: systemNames.length - 1
    });
  }

  return i18next.t('governanceReviewTeam:noneSpecified');
};

export default getSystemOrContractName;
