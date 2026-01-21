import {
  CedarAssigneeType,
  GetSystemProfileQuery
} from 'gql/generated/graphql';

import getAtoStatus from 'components/AtoStatus/getAtoStatus';
import {
  CedarRoleAssigneePerson,
  DevelopmentTag,
  RoleTypeName,
  SystemProfileData,
  UrlLocation,
  UrlLocationTag
} from 'types/systemProfile';
import { formatHttpsUrl } from 'utils/formatUrl';
import getUsernamesWithRoles from 'utils/getUsernamesWithRoles';

/**
 * Get a list of UrlLocations found from Cedar system Urls and Deployments.
 * A `UrlLocation` is extended from a Cedar Url with some additional parsing
 * and Deployment assignments.
 */
function getLocations(
  cedarSystemDetails: GetSystemProfileQuery['cedarSystemDetails']
): UrlLocation[] | undefined {
  if (!cedarSystemDetails?.urls) return undefined;

  return (cedarSystemDetails?.urls ?? []).map(url => {
    // Find a deployment from matching its type with the url host env
    const { urlHostingEnv } = url;
    const deployment = cedarSystemDetails?.deployments?.find(
      dpl => urlHostingEnv && dpl.deploymentType === urlHostingEnv
    );

    // Location tags derived from certain properties
    const tags: UrlLocationTag[] = [];
    if (url.isAPIEndpoint) tags.push('API endpoint');
    if (url.isVersionCodeRepository) tags.push('Versioned code respository');

    // Fix address urls without a protocol
    // and reassign it to the original address property
    const address = url.address && formatHttpsUrl(url.address);

    return {
      ...url,
      address,
      deploymentDataCenterName: deployment?.dataCenter?.name,
      tags
    };
  });
}

function getPlannedRetirement(
  cedarSystemDetails: GetSystemProfileQuery['cedarSystemDetails']
): string | null {
  const { plansToRetireReplace, quarterToRetireReplace, yearToRetireReplace } =
    cedarSystemDetails?.systemMaintainerInformation || {};

  // Return null if none of the original properties are truthy
  if (
    !(plansToRetireReplace || quarterToRetireReplace || yearToRetireReplace)
  ) {
    return null;
  }

  // Return a string where all falsy values are empty
  return `${plansToRetireReplace || ''} ${
    quarterToRetireReplace || yearToRetireReplace
      ? `(${`Q${quarterToRetireReplace || ''} ${
          yearToRetireReplace || ''
        }`.trim()})`
      : ''
  }`;
}

/**
 * Get Development Tags which are derived from various other properties.
 */
function getDevelopmentTags(
  cedarSystemDetails: GetSystemProfileQuery['cedarSystemDetails']
): DevelopmentTag[] {
  const tags: DevelopmentTag[] = [];
  if (cedarSystemDetails?.systemMaintainerInformation?.agileUsed === true) {
    tags.push('Agile Methodology');
  }
  return tags;
}

/**
 * `SystemProfileData` is a merge of request data and parsed data
 * required by SystemHome and at least one other subpage.
 * It is passed to all SystemProfile subpage components.
 */
const getSystemProfileData = (
  data?: GetSystemProfileQuery
): SystemProfileData | undefined => {
  const {
    cedarSystemDetails,
    cedarSoftwareProducts,
    cedarBudget,
    cedarBudgetSystemCost
  } = data || {};

  const cedarSystem = cedarSystemDetails?.cedarSystem;

  // Save CedarAssigneeType.PERSON roles for convenience
  const personRoles = cedarSystemDetails?.roles?.filter(
    role => role.assigneeType === CedarAssigneeType.PERSON
  );

  const businessOwners = personRoles?.filter(
    role => role.roleTypeName === RoleTypeName.BUSINESS_OWNER
  );

  const usernamesWithRoles = getUsernamesWithRoles(
    personRoles as CedarRoleAssigneePerson[]
  );

  const locations = getLocations(cedarSystemDetails);

  const productionLocation = locations?.find(
    location => location.urlHostingEnv === 'Production'
  );

  const cedarAuthorityToOperate = data?.cedarAuthorityToOperate?.[0];

  const numberOfContractorFte = parseFloat(
    cedarSystemDetails?.businessOwnerInformation?.numberOfContractorFte || '0'
  );

  const numberOfFederalFte = parseFloat(
    cedarSystemDetails?.businessOwnerInformation?.numberOfFederalFte || '0'
  );

  const numberOfFte = Number(
    (numberOfContractorFte + numberOfFederalFte).toFixed(2)
  );

  return {
    ...(data || ({} as GetSystemProfileQuery)),
    id: cedarSystem?.id || '',
    ato: cedarAuthorityToOperate,
    atoStatus: getAtoStatus(
      cedarAuthorityToOperate?.dateAuthorizationMemoExpires,
      cedarAuthorityToOperate?.oaStatus
    ),
    budgetSystemCosts: cedarBudgetSystemCost || undefined,
    budgets: cedarBudget || [],
    businessOwners: businessOwners || [],
    developmentTags: getDevelopmentTags(
      cedarSystemDetails || ({} as GetSystemProfileQuery['cedarSystemDetails'])
    ),
    locations,
    numberOfContractorFte,
    numberOfFederalFte,
    numberOfFte,
    oaStatus: cedarAuthorityToOperate?.oaStatus,
    personRoles: personRoles as CedarRoleAssigneePerson[] | undefined,
    plannedRetirement: getPlannedRetirement(cedarSystemDetails),
    productionLocation,
    status: cedarSystem?.status!,
    toolsAndSoftware: cedarSoftwareProducts || undefined,
    usernamesWithRoles
  };
};

export default getSystemProfileData;
