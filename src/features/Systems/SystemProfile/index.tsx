import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Link as RouterLink,
  NavLink,
  useLocation,
  useParams
} from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  GridContainer,
  Icon,
  Link,
  SideNav,
  SummaryBox,
  SummaryBoxContent
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import NotFound, { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import {
  activities as mockActivies,
  subSystems as mockSubSystems,
  systemData as mockSystemData
} from 'features/Systems/SystemProfile/data/mockSystemData';
import {
  CedarAssigneeType,
  GetSystemProfileQuery,
  useGetSystemProfileQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import { getAtoStatus } from 'components/AtoStatus';
import CollapsableLink from 'components/CollapsableLink';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import SectionWrapper from 'components/SectionWrapper';
import TLCTag from 'components/TLCTag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
import {
  CedarRoleAssigneePerson,
  DevelopmentTag,
  RoleTypeName,
  SubpageKey,
  SystemProfileData,
  UrlLocation,
  UrlLocationTag
} from 'types/systemProfile';
import { formatHttpsUrl } from 'utils/formatUrl';
import getUsernamesWithRoles from 'utils/getUsernamesWithRoles';
import { showSystemVal } from 'utils/showVal';

import BookmarkButton from '../../../components/BookmarkButton';

// components/index contains all the sideNavItems components, routes, labels and translations
// The sideNavItems object keys are mapped to the url param - 'subinfo'
import sideNavItems from './components/index';
import PointsOfContactSidebar from './components/PointsOfContactSidebar/PointsOfContactSidebar';
import SystemSubNav from './components/SystemSubNav/index';
import EditTeam from './components/Team/Edit';
import { getPersonFullName } from './util';

import './index.scss';

/**
 * Get Development Tags which are derived from various other properties.
 */
function getDevelopmentTags(
  // eslint-disable-next-line camelcase
  cedarSystemDetails: GetSystemProfileQuery['cedarSystemDetails']
): DevelopmentTag[] {
  const tags: DevelopmentTag[] = [];
  if (cedarSystemDetails?.systemMaintainerInformation.agileUsed === true) {
    tags.push('Agile Methodology');
  }
  return tags;
}

/**
 * Get a list of UrlLocations found from Cedar system Urls and Deployments.
 * A `UrlLocation` is extended from a Cedar Url with some additional parsing
 * and Deployment assignments.
 */
function getLocations(
  // eslint-disable-next-line camelcase
  cedarSystemDetails: GetSystemProfileQuery['cedarSystemDetails']
): UrlLocation[] {
  return (cedarSystemDetails?.urls ?? []).map(url => {
    // Find a deployment from matching its type with the url host env
    const { urlHostingEnv } = url;
    const deployment = cedarSystemDetails?.deployments.find(
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
  // eslint-disable-next-line camelcase
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
 * `SystemProfileData` is a merge of request data and parsed data
 * required by SystemHome and at least one other subpage.
 * It is passed to all SystemProfile subpage components.
 */
export function getSystemProfileData(
  data?: GetSystemProfileQuery
): SystemProfileData | undefined {
  const {
    cedarSystemDetails,
    cedarSoftwareProducts,
    cedarBudget,
    cedarBudgetSystemCost
  } = data || ({} as GetSystemProfileQuery);

  const cedarSystem = cedarSystemDetails?.cedarSystem;

  // Save CedarAssigneeType.PERSON roles for convenience
  const personRoles = cedarSystemDetails?.roles.filter(
    role => role.assigneeType === CedarAssigneeType.PERSON
  ) as CedarRoleAssigneePerson[];

  const businessOwners = personRoles.filter(
    role => role.roleTypeName === RoleTypeName.BUSINESS_OWNER
  );

  const usernamesWithRoles = getUsernamesWithRoles(personRoles);

  const locations = getLocations(cedarSystemDetails);

  const productionLocation = locations.find(
    location => location.urlHostingEnv === 'Production'
  );

  const cedarAuthorityToOperate = data?.cedarAuthorityToOperate[0];

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
    personRoles,
    plannedRetirement: getPlannedRetirement(cedarSystemDetails),
    productionLocation,
    status: cedarSystem?.status!,
    toolsAndSoftware: cedarSoftwareProducts || undefined,
    usernamesWithRoles,

    // Remaining mock data stubs
    activities: mockActivies,
    subSystems: mockSubSystems,
    systemData: mockSystemData
  };
}

type SystemProfileProps = {
  id?: string;
  modal?: boolean;
};

const SystemProfile = ({ id, modal }: SystemProfileProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const flags = useFlags();

  const location = useLocation();
  const params = useParams<{
    subinfo: SubpageKey;
    systemId: string;
    edit?: 'edit';
    top: string;
  }>();

  const { subinfo, top, edit } = params;
  const systemId = id || params.systemId;
  const { hash } = location;

  const [modalSubpage, setModalSubpage] = useState<SubpageKey>('home');

  // Scroll to top if redirect
  useLayoutEffect(() => {
    if (top) {
      window.scrollTo(0, 0);
    }
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView();
      }
    }
  }, [top, hash]);

  // const { loading, error, data } = useGetSystemProfileQuery({
  //   variables: {
  //     cedarSystemId: systemId
  //   }
  // });

  const loading = false;
  const error = {
    graphQLErrors: [
      {
        message:
          'json: cannot unmarshal string into Go struct field SoftwareProductsSearchItem.softwareProducts.provides_ai_capability of type bool',
        path: ['cedarSoftwareProducts']
      }
    ]
  };
  const data = {
    cedarAuthorityToOperate: [
      {
        uuid: '75259954-6177-427A-B4C5-2A9186D117E5',
        actualDispositionDate: null,
        containsPersonallyIdentifiableInformation: true,
        countOfTotalNonPrivilegedUserPopulation: 0,
        countOfOpenPoams: 0,
        countOfTotalPrivilegedUserPopulation: 0,
        dateAuthorizationMemoExpires: '2024-09-23T00:00:00Z',
        dateAuthorizationMemoSigned: '2021-09-23T00:00:00Z',
        eAuthenticationLevel: 'N/A',
        fips199OverallImpactRating: 2,
        fismaSystemAcronym: 'ACO-MS',
        fismaSystemName: 'Accountable Care Organization Management System',
        isAccessedByNonOrganizationalUsers: false,
        isPiiLimitedToUserNameAndPass: false,
        isProtectedHealthInformation: false,
        lastActScaDate: '2024-07-11T00:00:00Z',
        lastAssessmentDate: '2024-09-03T00:00:00Z',
        lastContingencyPlanCompletionDate: '2025-02-27T00:00:00Z',
        lastPenTestDate: '2024-09-03T00:00:00Z',
        oaStatus: null,
        piaCompletionDate: '2020-11-18T00:00:00Z',
        primaryCyberRiskAdvisor: 'CMSTestUser,PrimCRA',
        privacySubjectMatterExpert: null,
        recoveryPointObjective: 8,
        recoveryTimeObjective: 120,
        systemOfRecordsNotice: ['09-70-0598'],
        tlcPhase: 'Operate',
        __typename: 'CedarAuthorityToOperate'
      },
      {
        uuid: '05E2F585-8A9A-4F17-B830-E34D54455099',
        actualDispositionDate: null,
        containsPersonallyIdentifiableInformation: true,
        countOfTotalNonPrivilegedUserPopulation: 0,
        countOfOpenPoams: 0,
        countOfTotalPrivilegedUserPopulation: 0,
        dateAuthorizationMemoExpires: '2027-08-02T00:00:00Z',
        dateAuthorizationMemoSigned: '2024-08-02T00:00:00Z',
        eAuthenticationLevel: '4',
        fips199OverallImpactRating: 3,
        fismaSystemAcronym: 'CM - WPS',
        fismaSystemName: 'CM - Wisconsin Physician Services',
        isAccessedByNonOrganizationalUsers: true,
        isPiiLimitedToUserNameAndPass: false,
        isProtectedHealthInformation: true,
        lastActScaDate: '2025-05-22T00:00:00Z',
        lastAssessmentDate: '2025-05-22T00:00:00Z',
        lastContingencyPlanCompletionDate: '2025-03-10T00:00:00Z',
        lastPenTestDate: '2024-05-13T00:00:00Z',
        oaStatus: 'Traditional',
        piaCompletionDate: '2021-08-06T00:00:00Z',
        primaryCyberRiskAdvisor: 'CMSTestUser,PrimCRA',
        privacySubjectMatterExpert: null,
        recoveryPointObjective: 24,
        recoveryTimeObjective: 72,
        systemOfRecordsNotice: ['09-70-0501', '09-70-0503'],
        tlcPhase: 'Operate',
        __typename: 'CedarAuthorityToOperate'
      }
    ],
    exchanges: [
      {
        connectionFrequency: ['Daily'],
        containsHealthDisparityData: false,
        containsPhi: false,
        dataExchangeAgreement: 'CMS Contract and Service Agreement',
        exchangeDescription: 'Provider Enrollment information',
        exchangeDirection: 'RECEIVER',
        exchangeId: '{2433D686-C76B-4a58-87F7-B74F72968337}',
        exchangeName: 'Provider Enrollment information',
        numOfRecords: '1000 - 100,000',
        sharedViaApi: false,
        __typename: 'CedarExchange'
      },
      {
        connectionFrequency: ['Monthly'],
        containsHealthDisparityData: false,
        containsPhi: false,
        dataExchangeAgreement: 'CMS Contract and Service Agreement',
        exchangeDescription: 'ACO agreement level information',
        exchangeDirection: 'SENDER',
        exchangeId: '{60D294A6-F89F-45da-B8DA-66ED29AE31B9}',
        exchangeName: 'ACO agreement level information',
        numOfRecords: '1000 - 100,000',
        sharedViaApi: false,
        __typename: 'CedarExchange'
      },
      {
        connectionFrequency: ['Real-Time'],
        containsHealthDisparityData: false,
        containsPhi: false,
        dataExchangeAgreement: 'CMS Contract and Service Agreement',
        exchangeDescription:
          'It contains the complaint data that the user submits on the https://www.cms.gov/hospital-price-transparency to CMS if it appears that a hospital has not provided clear, accessible pricing information online about the items and services that they provide in two ways:  As a comprehensive machine-readable file with all items and services.  In a display of shoppable services in a consumer friendly format. Information online against hospital has not posted information online.',
        exchangeDirection: 'RECEIVER',
        exchangeId: '{6C857ADE-F012-4d00-8957-36790ABE9A8D}',
        exchangeName: 'Qualtrics - complaint data that the user submits',
        numOfRecords: '< 1000',
        sharedViaApi: true,
        __typename: 'CedarExchange'
      },
      {
        connectionFrequency: ['Ad Hoc/As Needed'],
        containsHealthDisparityData: false,
        containsPhi: false,
        dataExchangeAgreement: 'Memorandum of Understanding (MOU)',
        exchangeDescription:
          'SSP Program Analysis Contractor (RTI) sends SSP ACO Participant options report data and other adhoc files as needed to ACO-MS during SSP Application cycle to support SSP Application adjudication activities.',
        exchangeDirection: 'RECEIVER',
        exchangeId: '{A4B99BC6-4F88-4aca-A63B-478D832EF58A}',
        exchangeName:
          'Participant Options and Application adjudication support data',
        numOfRecords: '1000 - 100,000',
        sharedViaApi: true,
        __typename: 'CedarExchange'
      },
      {
        connectionFrequency: ['Ad Hoc/As Needed', 'Other'],
        containsHealthDisparityData: false,
        containsPhi: false,
        dataExchangeAgreement: 'Interface Control Document (ICD)',
        exchangeDescription:
          'RESTful Webservice - User, Role and Attribute data.',
        exchangeDirection: 'RECEIVER',
        exchangeId: '{AC57DD75-2295-44ed-88D8-5B7D35DE1132}',
        exchangeName: 'IDM Webservice',
        numOfRecords: '< 1000',
        sharedViaApi: true,
        __typename: 'CedarExchange'
      },
      {
        connectionFrequency: ['Monthly', 'Ad Hoc/As Needed'],
        containsHealthDisparityData: false,
        containsPhi: false,
        dataExchangeAgreement: 'Memorandum of Understanding (MOU)',
        exchangeDescription:
          'Shared Savings Program (SSP) organization agreement and contact information.',
        exchangeDirection: 'SENDER',
        exchangeId: '{E3CCC061-7356-45c5-B331-CD69A7524E1D}',
        exchangeName:
          'Shared Savings Program (SSP) organization agreement and contact information',
        numOfRecords: '< 1000',
        sharedViaApi: false,
        __typename: 'CedarExchange'
      },
      {
        connectionFrequency: ['Annually'],
        containsHealthDisparityData: false,
        containsPhi: true,
        dataExchangeAgreement: 'CMS Contract and Service Agreement',
        exchangeDescription:
          'PPCP Eligible ParticipantTIN Details for PCFlex program',
        exchangeDirection: 'RECEIVER',
        exchangeId: '{1941EB6E-B107-44F1-B9C6-DC5074DC8458}',
        exchangeName: 'PPCP Eligible ParticipantTIN Details',
        numOfRecords: '1000 - 100,000',
        sharedViaApi: false,
        __typename: 'CedarExchange'
      },
      {
        connectionFrequency: ['Monthly'],
        containsHealthDisparityData: false,
        containsPhi: false,
        dataExchangeAgreement: 'CMS Contract and Service Agreement',
        exchangeDescription: 'PCFlex agreement data',
        exchangeDirection: 'SENDER',
        exchangeId: '{2D7469BE-AFF6-42B0-94D7-6086F945AD28}',
        exchangeName: 'PCFlex agreement data',
        numOfRecords: '< 1000',
        sharedViaApi: false,
        __typename: 'CedarExchange'
      },
      {
        connectionFrequency: ['Weekly'],
        containsHealthDisparityData: false,
        containsPhi: false,
        dataExchangeAgreement: 'No',
        exchangeDescription:
          'The integration with ACOMS (Accountable Care Organizations Management System), containing the ACO Legal Name and Entity IDs, is designed to automate the entry of Entity IDs on the Quality Payment Program (QPP) case form, particularly for Medicare Shared Savings Program Accountable Care Organizations. This automation aims to eliminate the need for manual input of these IDs, reducing errors and increasing efficiency.',
        exchangeDirection: 'SENDER',
        exchangeId: '{4F2C5F18-8E65-4691-90FA-B007A30A579E}',
        exchangeName: 'CCSQ ServiceNow / ACOMS',
        numOfRecords: '< 1000',
        sharedViaApi: true,
        __typename: 'CedarExchange'
      },
      {
        connectionFrequency: ['Quarterly'],
        containsHealthDisparityData: false,
        containsPhi: false,
        dataExchangeAgreement: 'Memorandum of Understanding (MOU)',
        exchangeDescription: 'Test',
        exchangeDirection: 'RECEIVER',
        exchangeId: '{637E0C68-8E2B-47BC-8085-4520A6D8D882}',
        exchangeName: 'Test 1 - System to Census System',
        numOfRecords: '< 1000',
        sharedViaApi: false,
        __typename: 'CedarExchange'
      },
      {
        connectionFrequency: ['Ad Hoc/As Needed'],
        containsHealthDisparityData: false,
        containsPhi: false,
        dataExchangeAgreement: 'CMS Contract and Service Agreement',
        exchangeDescription:
          'PCFlex file containing Authorized official and Designated official contacts',
        exchangeDirection: 'SENDER',
        exchangeId: '{84C64F12-0482-416C-9214-FC50D756E5FB}',
        exchangeName: 'PCFlex AO/DO Data file',
        numOfRecords: '< 1000',
        sharedViaApi: false,
        __typename: 'CedarExchange'
      },
      {
        connectionFrequency: ['Quarterly'],
        containsHealthDisparityData: false,
        containsPhi: true,
        dataExchangeAgreement: 'CMS Contract and Service Agreement',
        exchangeDescription:
          'ACO background data along with contacts, financial, quality, compliance, reconsideration and AdvanceInvestmentPayment details',
        exchangeDirection: 'RECEIVER',
        exchangeId: '{D7EB4C6E-0C8C-486C-86DA-1429734EC213}',
        exchangeName: 'Bigpicture Details',
        numOfRecords: '< 1000',
        sharedViaApi: false,
        __typename: 'CedarExchange'
      }
    ],
    cedarBudget: [
      {
        fiscalYear: '2023',
        funding:
          'Only part of this funding is directly for this system (less than 40%)',
        fundingId: '{D37083B9-D7D4-4be8-B104-5255AB3EEF90}',
        fundingSource: null,
        id: '{3A74C77B-B1E2-4f64-98E3-778207A0A0E6}',
        name: null,
        projectId: '000707',
        projectTitle:
          '000707-ACA Accountable Care Organization - Medicare Shared Savings',
        systemId: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
        __typename: 'CedarBudget'
      },
      {
        fiscalYear: '2023',
        funding: null,
        fundingId: '{A0226673-E2D3-4021-BE7A-AF1EA563E96E}',
        fundingSource: null,
        id: '{1D0F251A-7A60-496f-9E36-CCE0F079800E}',
        name: null,
        projectId: '009568',
        projectTitle: '009568-Tribal Printing',
        systemId: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
        __typename: 'CedarBudget'
      },
      {
        fiscalYear: '2023',
        funding:
          'Most of this funding is directly and only for this system (over 80%)',
        fundingId: '{4E7A2F05-B1E4-4901-B76B-99BA12E007B7}',
        fundingSource: null,
        id: '{38CC74FF-B3F1-45cf-A8AC-4D2FEFC1F39F}',
        name: null,
        projectId: '001613',
        projectTitle: '001613-Application Processing System',
        systemId: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
        __typename: 'CedarBudget'
      }
    ],
    cedarBudgetSystemCost: {
      budgetActualCost: [
        {
          actualSystemCost: '1.884E7',
          fiscalYear: '2023',
          systemId: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          __typename: 'CedarBudgetActualCost'
        },
        {
          actualSystemCost: '1.533E7',
          fiscalYear: '2022',
          systemId: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          __typename: 'CedarBudgetActualCost'
        },
        {
          actualSystemCost: '1.390865575E7',
          fiscalYear: '2021',
          systemId: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          __typename: 'CedarBudgetActualCost'
        },
        {
          actualSystemCost: '1.2009121E7',
          fiscalYear: '2020',
          systemId: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          __typename: 'CedarBudgetActualCost'
        },
        {
          actualSystemCost: '1.2009121E7',
          fiscalYear: '2019',
          systemId: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          __typename: 'CedarBudgetActualCost'
        },
        {
          actualSystemCost: '3168000.0',
          fiscalYear: '2018',
          systemId: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          __typename: 'CedarBudgetActualCost'
        },
        {
          actualSystemCost: '3168000.0',
          fiscalYear: '2017',
          systemId: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          __typename: 'CedarBudgetActualCost'
        }
      ],
      __typename: 'CedarBudgetSystemCost'
    },
    cedarThreat: [],
    cedarSoftwareProducts: null,
    cedarContractsBySystem: [
      {
        systemID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
        startDate: null,
        endDate: null,
        contractNumber: 'GS35F372DA',
        contractName: 'ACO-MS',
        description: null,
        orderNumber: '75FCMC24F0108',
        serviceProvided: null,
        isDeliveryOrg: true,
        __typename: 'CedarContract'
      }
    ],
    cedarSystemDetails: {
      isMySystem: true,
      businessOwnerInformation: {
        isCmsOwned: true,
        numberOfContractorFte: '100',
        numberOfFederalFte: '12',
        numberOfSupportedUsersPerMonth: '10000',
        storesBeneficiaryAddress: false,
        storesBankingData: true,
        __typename: 'CedarBusinessOwnerInformation'
      },
      cedarSystem: {
        id: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
        isBookmarked: false,
        name: 'Accountable Care Organization Management System',
        description:
          'The Accountable Care Organization - Management System (ACO-MS) allows CMS to collect information from Accountable Care Organizations (ACOs) participating in the Shared Savings Program (SSP), and assists ACOs in the management of their ACO agreement. The ACO-MS will be used to support agreement enumeration and management, application submission and tracking, participant and affiliate list management activities, as well as the annual certification process. Examples of the various components of the application cycle supported include executing and maintaining the ACO agreement and contacts, the participant list, and the skilled nursing facility (SNF) affiliate list.\r\nThe ACO-MS system also supports the web application front for paper application processes called MEARiS™ - Medicare Electronic Application Request Information System™. This application allows external organizations to replace their paper submissions for the related application, and use a web interface to make a request to the government related to a medical coding, medical classification, or payment policy.\r\n(HPT)- Each hospital operating in the United States will be required to provide clear, accessible pricing information online about the items and services they provide in two ways:\r\n- As a comprehensive machine-readable file with all items and services.\r\n- In a display of shoppable services in a consumer-friendly format.\r\nThis information will make it easier for consumers to shop and compare prices across hospitals and estimate the cost of care before going to the hospital. This system will help CMS audit hospitals for compliance, in addition to investigating complaints that are submitted to CMS and reviewing analyses of non-compliance.',
        acronym: 'ACO-MS',
        status: null,
        businessOwnerOrg: 'Performance-Based Payment Policy Group',
        businessOwnerOrgComp: 'CM-(FFS)',
        systemMaintainerOrg: 'Performance-Based Payment Policy Group',
        systemMaintainerOrgComp: 'CM-(FFS)',
        uuid: '75259954-6177-427A-B4C5-2A9186D117E5',
        __typename: 'CedarSystem'
      },
      deployments: [
        {
          id: '{29AA6E3C-5EE5-453b-AE33-788025E9B893}',
          startDate: null,
          dataCenter: {
            name: 'CMS Amazon Web Services',
            __typename: 'CedarDataCenter'
          },
          deploymentType: 'Testing',
          name: 'Accountable Care Organization Management System (Testing)',
          __typename: 'CedarDeployment'
        },
        {
          id: '{921741FA-CA8C-4ffb-954E-3B505C4FCB14}',
          startDate: null,
          dataCenter: {
            name: 'CMS Amazon Web Services',
            __typename: 'CedarDataCenter'
          },
          deploymentType: 'Implementation',
          name: 'Accountable Care Organization Management System (Implementation)',
          __typename: 'CedarDeployment'
        },
        {
          id: '{93FEE947-0F67-4c06-82D0-B33DE4D96D18}',
          startDate: null,
          dataCenter: {
            name: 'CMS Amazon Web Services',
            __typename: 'CedarDataCenter'
          },
          deploymentType: 'Development',
          name: 'Accountable Care Organization Management System (Development)',
          __typename: 'CedarDeployment'
        },
        {
          id: '{E239DC7B-0AD3-4d86-A19C-F9126EB31503}',
          startDate: null,
          dataCenter: {
            name: 'CMS Amazon Web Services',
            __typename: 'CedarDataCenter'
          },
          deploymentType: 'Production',
          name: 'Accountable Care Organization Management System (Production)',
          __typename: 'CedarDeployment'
        }
      ],
      roles: [
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{1FD4F238-56A1-46d2-8CB1-8A7C87F63A01}',
          assigneeType: 'PERSON',
          assigneeUsername: 'GYDL',
          assigneeEmail: 'tej.ghimire@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'TEJ',
          assigneeLastName: 'Ghimire (CMS/OIT)',
          roleTypeName: 'API Contact',
          roleID: '{173EF56D-D82A-4A85-AF89-7B26BAE1AD20}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{36335B21-40F4-48de-8D16-8F85277C54B8}',
          assigneeType: 'PERSON',
          assigneeUsername: 'B4UU',
          assigneeEmail: 'cathy.laruffa@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'CATHY',
          assigneeLastName: 'LaRuffa',
          roleTypeName: 'System Maintainer',
          roleID: '{27718028-DDDC-4f97-B524-3C6E9169520F}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{8C6FCC75-FCDE-4133-8C54-BCA6160E34C1}',
          assigneeType: 'PERSON',
          assigneeUsername: 'GYDL',
          assigneeEmail: 'tej.ghimire@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'TEJ',
          assigneeLastName: 'Ghimire (CMS/OIT)',
          roleTypeName: 'Survey Point of Contact',
          roleID: '{27845D96-800B-4A01-B5C4-62A80AC64599}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{ED77C4FD-3078-4f65-8FD4-7350DBAE7283}',
          assigneeType: 'PERSON',
          assigneeUsername: 'V2LY',
          assigneeEmail: 'kari.vandegrift@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'KARI',
          assigneeLastName: 'VANDEGRIFT',
          roleTypeName: 'System Issues Contact',
          roleID: '{50F40781-C0A7-4cee-B21A-EB2C8B325317}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{C95EA2F9-1A08-4b1a-AEE7-A83011D06113}',
          assigneeType: 'PERSON',
          assigneeUsername: 'P183',
          assigneeEmail: 'No longer with CMS',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'John',
          assigneeLastName: 'Pilotte',
          roleTypeName: 'Business Owner',
          roleID: '{52A9F1A6-F7DE-433d-BB06-8B2D2DC187E5}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{260896F7-76AB-4e8d-8FF6-E8A0431B1F6A}',
          assigneeType: 'PERSON',
          assigneeUsername: 'GRN6',
          assigneeEmail: 'No longer with CMS',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'Rodney',
          assigneeLastName: 'McDonald',
          roleTypeName: 'Business Question Contact',
          roleID: '{5A372B81-59D5-4172-8AAE-BEBE4257E1E5}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{ED77C4FD-3078-4f65-8FD4-7350DBAE7283}',
          assigneeType: 'PERSON',
          assigneeUsername: 'GYDL',
          assigneeEmail: 'tej.ghimire@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'TEJ',
          assigneeLastName: 'Ghimire (CMS/OIT)',
          roleTypeName: 'System Issues Contact',
          roleID: '{5B5542AE-1D01-45CD-A4B7-2373FDCBF570}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{CAE32572-2A36-4d50-9F73-A0EE0A1A6437}',
          assigneeType: 'PERSON',
          assigneeUsername: 'S613',
          assigneeEmail: 'No longer with CMS',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'Gregg',
          assigneeLastName: 'Sanders',
          roleTypeName: 'ISSO',
          roleID: '{5E491FB2-6237-46ac-8145-98495069F661}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{9DAEBF37-868B-408c-8C7A-1ADECE73F4C4}',
          assigneeType: 'PERSON',
          assigneeUsername: 'SCK5',
          assigneeEmail: 'anusha.sathyanarayan@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'Anusha',
          assigneeLastName: 'Sathyanarayan (CMS/OIT)',
          roleTypeName: 'Subject Matter Expert (SME)',
          roleID: '{5E870F26-E9A8-4A37-8C83-394343926DEB}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{CAE32572-2A36-4d50-9F73-A0EE0A1A6437}',
          assigneeType: 'PERSON',
          assigneeUsername: 'B4UU',
          assigneeEmail: 'cathy.laruffa@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'CATHY',
          assigneeLastName: 'LaRuffa',
          roleTypeName: 'ISSO',
          roleID: '{77AC6F94-7B21-47E9-8502-3A93BF4CC005}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{9DAEBF37-868B-408c-8C7A-1ADECE73F4C4}',
          assigneeType: 'PERSON',
          assigneeUsername: 'V2LY',
          assigneeEmail: 'kari.vandegrift@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'KARI',
          assigneeLastName: 'VANDEGRIFT',
          roleTypeName: 'Subject Matter Expert (SME)',
          roleID: '{796CF862-CF2F-421f-A965-C330111B988E}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{260896F7-76AB-4e8d-8FF6-E8A0431B1F6A}',
          assigneeType: 'PERSON',
          assigneeUsername: 'V2LY',
          assigneeEmail: 'kari.vandegrift@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'KARI',
          assigneeLastName: 'VANDEGRIFT',
          roleTypeName: 'Business Question Contact',
          roleID: '{9F3964D0-4433-4a34-A451-0D1C4253DFA3}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{ED77C4FD-3078-4f65-8FD4-7350DBAE7283}',
          assigneeType: 'PERSON',
          assigneeUsername: 'B4UU',
          assigneeEmail: 'cathy.laruffa@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'CATHY',
          assigneeLastName: 'LaRuffa',
          roleTypeName: 'System Issues Contact',
          roleID: '{9F41B956-4B6B-46a4-B5CE-3CF3F5669461}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{36335B21-40F4-48de-8D16-8F85277C54B8}',
          assigneeType: 'PERSON',
          assigneeUsername: 'GYDL',
          assigneeEmail: 'tej.ghimire@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'TEJ',
          assigneeLastName: 'Ghimire (CMS/OIT)',
          roleTypeName: 'System Maintainer',
          roleID: '{ABB2D27E-836A-4BA0-A5A9-0EC91CB96D82}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{60457806-27EC-406e-BD29-331E286DD314}',
          assigneeType: 'PERSON',
          assigneeUsername: 'P5AK',
          assigneeEmail: 'sita.paturi@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'Sita',
          assigneeLastName: 'Paturi',
          roleTypeName: 'Support Staff',
          roleID: '{B39D405D-9C70-47BB-9882-A1AC7ED037F8}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{AF31974C-95AD-49f8-BCF5-D26BC664EC93}',
          assigneeType: 'PERSON',
          assigneeUsername: 'XG12',
          assigneeEmail: 'rochelle.scott@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'Rochelle',
          assigneeLastName: 'Scott',
          roleTypeName: 'Budget Analyst',
          roleID: '{BD86901C-C5EE-4275-950F-4A5E6B91C792}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{260896F7-76AB-4e8d-8FF6-E8A0431B1F6A}',
          assigneeType: 'PERSON',
          assigneeUsername: 'XG12',
          assigneeEmail: 'rochelle.scott@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'Rochelle',
          assigneeLastName: 'Scott',
          roleTypeName: 'Business Question Contact',
          roleID: '{C17A7B0B-5137-4429-93F3-12C3D6E0C978}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{9DAEBF37-868B-408c-8C7A-1ADECE73F4C4}',
          assigneeType: 'PERSON',
          assigneeUsername: 'GYDL',
          assigneeEmail: 'tej.ghimire@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'TEJ',
          assigneeLastName: 'Ghimire (CMS/OIT)',
          roleTypeName: 'Subject Matter Expert (SME)',
          roleID: '{CD9505CD-B275-4546-B75E-E2AE3A6C9FDD}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{C266D5BF-C298-4ec9-AE49-24DBB8577947}',
          assigneeType: 'PERSON',
          assigneeUsername: 'B4UU',
          assigneeEmail: 'cathy.laruffa@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'CATHY',
          assigneeLastName: 'LaRuffa',
          roleTypeName: 'System Data Center Contact',
          roleID: '{D5BA5C95-1A7F-4840-98E1-7CFB60263464}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{1FD4F238-56A1-46d2-8CB1-8A7C87F63A01}',
          assigneeType: 'PERSON',
          assigneeUsername: 'SV8L',
          assigneeEmail: 'patrick.segura@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'Patrick',
          assigneeLastName: 'Segura',
          roleTypeName: 'API Contact',
          roleID: '{DC2CF60C-71BF-4EE9-BA0D-6A321C5D14A7}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{260896F7-76AB-4e8d-8FF6-E8A0431B1F6A}',
          assigneeType: 'PERSON',
          assigneeUsername: 'B4UU',
          assigneeEmail: 'cathy.laruffa@cms.hhs.gov',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'CATHY',
          assigneeLastName: 'LaRuffa',
          roleTypeName: 'Business Question Contact',
          roleID: '{E9BEF738-D4F2-4f79-AABB-7F828F83172B}',
          __typename: 'CedarRole'
        },
        {
          application: 'alfabet',
          objectID: '{D26DFC38-9F52-4807-B05B-46BAACA316F9}',
          roleTypeID: '{AB303F45-E6ED-488d-95C1-065457F46028}',
          assigneeType: 'PERSON',
          assigneeUsername: 'GRN6',
          assigneeEmail: 'No longer with CMS',
          assigneeOrgID: null,
          assigneeOrgName: null,
          assigneeFirstName: 'Rodney',
          assigneeLastName: 'McDonald',
          roleTypeName: "Contracting Officer's Representative (COR)",
          roleID: '{F6894822-9DF1-4f39-9762-99ACE0BEA93B}',
          __typename: 'CedarRole'
        }
      ],
      urls: [
        {
          id: '{3158A07B-FE1A-47a8-B967-1C29E426FADA}',
          address: 'github.cms.gov/MEARIS',
          isAPIEndpoint: false,
          isBehindWebApplicationFirewall: false,
          isVersionCodeRepository: false,
          urlHostingEnv: 'Versioned Code Repository',
          __typename: 'CedarURL'
        },
        {
          id: '{3B3AA410-746F-48a7-B7BA-707C24A89524}',
          address: 'github.cms.gov/hpt',
          isAPIEndpoint: false,
          isBehindWebApplicationFirewall: false,
          isVersionCodeRepository: false,
          urlHostingEnv: 'Versioned Code Repository',
          __typename: 'CedarURL'
        },
        {
          id: '{6033280A-159E-445c-B9F4-E053C8BEC502}',
          address: 'github.cms.gov/ACOMS',
          isAPIEndpoint: false,
          isBehindWebApplicationFirewall: false,
          isVersionCodeRepository: false,
          urlHostingEnv: 'Versioned Code Repository',
          __typename: 'CedarURL'
        },
        {
          id: '{84BC5A35-659D-4c64-ADB0-E2143BE50DDF}',
          address: 'acoms.cms.gov',
          isAPIEndpoint: false,
          isBehindWebApplicationFirewall: true,
          isVersionCodeRepository: false,
          urlHostingEnv: 'Production',
          __typename: 'CedarURL'
        },
        {
          id: '{A67F55BC-0C1A-4352-B788-93C093D90126}',
          address: 'hpt.cms.gov',
          isAPIEndpoint: false,
          isBehindWebApplicationFirewall: true,
          isVersionCodeRepository: false,
          urlHostingEnv: 'Production',
          __typename: 'CedarURL'
        },
        {
          id: '{BE03DA32-C828-4b59-BE94-3CC370E39C8B}',
          address: 'mearis.cms.gov',
          isAPIEndpoint: false,
          isBehindWebApplicationFirewall: true,
          isVersionCodeRepository: false,
          urlHostingEnv: 'Production',
          __typename: 'CedarURL'
        }
      ],
      systemMaintainerInformation: {
        agileUsed: true,
        deploymentFrequency: 'Every Two Weeks',
        devCompletionPercent: '75% - 99%',
        devWorkDescription:
          'UPDATE 1\n\nACOMS \n-  2026 Registration and Application submission, 2025 Final Dispositions, 2025 Signing Event, Compliance and Marketing Enhancements, Repayment Enhancements, AODO Integration (CMMI), MAss Email Updates, Termonation Changes, LEN Changes \n\nHPT -  TAR MVP, TAR Post MVP, 2025 Assessment Changes, Complaint Page updates, CMP Phase updates \n\nMEARIS -  Generate Application Report, and in-progress application report, Create a form within HCPCS non-drug applications for CMS to provide an application code’s benefit category (BCD), Autosave application data, create template letters and events functionality for ICD-10-PCS, Preview/View attachments in MEARIS for all modules, allowing multiple email IDs for notification to CMS, assign Multiple Applications to a Reviewer, Bulk status update, Angular V18 Upgrade, Pagination and Filtering for Applications, Upgrades to Terraform, Latest Version for Security Patches, Added Websocket Support.\n\n',
        ecapParticipation: true,
        frontendAccessType: 'IPv4 Only',
        hardCodedIPAddress: true,
        ip6EnabledAssetPercent: 'Less than 20%',
        ip6TransitionPlan: 'Yes, transition to IPv6',
        ipEnabledAssetCount: 50,
        netAccessibility:
          'Accessible to both public internet and to CMS-internal network',
        plansToRetireReplace: 'Yes - Retire and Replace',
        quarterToRetireReplace: '4',
        systemCustomization: 'Mixed',
        yearToRetireReplace: '2032',
        __typename: 'CedarSystemMaintainerInformation'
      },
      __typename: 'CedarSystemDetails'
    },
    cedarSubSystems: [
      {
        id: '{F1E0EC82-7D66-41f5-A1B6-90D3DDD2FFBF}',
        name: 'Hospital Pricing Transparency',
        acronym: 'HPT',
        description:
          'Each hospital operating in the United States will be required to provide clear, accessible pricing information online about the items and services they provide in two ways:\nAs a comprehensive machine-readable file with all items and services.\nIn a display of shoppable services in a consumer-friendly format.\nThis information will make it easier for consumers to shop and compare prices across hospitals and estimate the cost of care before going to the hospital. This system will help CMS audit hospitals for compliance, in addition to investigating complaints that are submitted to CMS and reviewing analyses of non-compliance.',
        __typename: 'CedarSubSystem'
      },
      {
        id: '{26AB6523-A94D-4ab4-910F-228D13CC2753}',
        name: 'Customer Relationship Module ',
        acronym: 'CRM',
        description: 'Saleforce integration for Helpdesk support',
        __typename: 'CedarSubSystem'
      },
      {
        id: '{8CCA23E8-2D46-46af-88B9-FDDD156CEA6F}',
        name: 'Medicare Electronic Application Request Information System',
        acronym: 'MEARIS',
        description:
          'MEARIS provides an online interface for Medicare providers to submit Hospital Inpatient Applications, Hospital Outpatient Applications, and HCPCS Level II Applications. MEARIS enables CMS to electronically store, review, track, and process these submissions.',
        __typename: 'CedarSubSystem'
      }
    ]
  };

  const cedarErrors = error?.graphQLErrors || [];

  // Header description expand toggle
  const descriptionRef = React.createRef<HTMLElement>();
  const [isDescriptionExpandable, setIsDescriptionExpandable] =
    useState<boolean>(false);
  const [descriptionExpanded, setDescriptionExpanded] =
    useState<boolean>(false);

  // Enable the description toggle if it overflows
  useEffect(() => {
    const { current: el } = descriptionRef;
    if (!el) return;
    if (el.scrollHeight > el.offsetHeight) {
      setIsDescriptionExpandable(true);
    }
  }, [descriptionRef]);

  const systemProfileData: SystemProfileData | undefined = useMemo(
    () => getSystemProfileData(data),
    [data]
  );

  const fields = useMemo(() => {
    if (!data) return {};

    const { cedarSystemDetails } = data!;
    if (!cedarSystemDetails) return {};

    return {
      cedarSystem: cedarSystemDetails.cedarSystem,
      cmsComponent: cedarSystemDetails.cedarSystem.businessOwnerOrg
    };
  }, [data]);

  const { cedarSystem, cmsComponent } = fields;

  if (loading) {
    return <PageLoading />;
  }

  if (!systemProfileData || !cedarSystem) {
    return <NotFound />;
  }

  const { businessOwners, productionLocation } = systemProfileData;

  const subComponents = sideNavItems(
    systemProfileData,
    flags.systemProfileHiddenFields
  );

  const subpageKey: SubpageKey = subinfo || modalSubpage || 'home';

  // Mapping of all sub navigation links
  const subNavigationLinks: React.ReactNode[] = Object.keys(subComponents).map(
    (key: string) => {
      const comp = subComponents[key];
      if (modal)
        return (
          <Button
            key={key}
            className={classnames({
              'nav-group-border': subComponents[key].groupEnd,
              'usa-current': modalSubpage === key
            })}
            type="button"
            onClick={() => setModalSubpage(key as SubpageKey)}
            unstyled
          >
            {t(`navigation.${key}`)}
          </Button>
        );
      return (
        <>
          <NavLink
            to={subComponents[key].route}
            key={key}
            activeClassName="usa-current"
            className={classnames({
              'nav-group-border': subComponents[key].groupEnd
            })}
          >
            {t(`navigation.${key}`)}
          </NavLink>
          {comp.hashLinks &&
            key === subpageKey &&
            comp.hashLinks.map((sub, subidx) => {
              return (
                <NavHashLink
                  to={sub.hash}
                  key={key + sub.name}
                  className="margin-left-4"
                  activeClassName="text-bold text-primary"
                >
                  {sub.name}
                </NavHashLink>
              );
            })}
        </>
      );
    }
  );

  const subComponent = subComponents[subpageKey];

  if (subinfo === 'team' && edit) {
    return (
      <EditTeam
        name={cedarSystem.name}
        team={systemProfileData.usernamesWithRoles || []}
        numberOfFederalFte={systemProfileData.numberOfFederalFte}
        numberOfContractorFte={systemProfileData.numberOfContractorFte}
      />
    );
  }

  return (
    <MainContent>
      <div id="system-profile">
        <SummaryBox className="padding-0 border-0 radius-0 bg-primary-lighter">
          <SummaryBoxContent>
            <div className="padding-top-3 padding-bottom-3 margin-top-neg-1 height-full">
              <Grid
                className={classnames('grid-container', {
                  'maxw-none': modal
                })}
              >
                <div className="display-flex flex-align-center margin-top-neg-05">
                  {!modal && (
                    <BreadcrumbBar
                      variant="wrap"
                      className="bg-transparent padding-0"
                    >
                      <Breadcrumb>
                        <span>&larr; </span>
                        <BreadcrumbLink asCustom={RouterLink} to="/systems">
                          <span>{t('singleSystem.summary.back')}</span>
                        </BreadcrumbLink>
                      </Breadcrumb>
                    </BreadcrumbBar>
                  )}
                  <div className="margin-left-auto" style={{ flexShrink: 0 }}>
                    <BookmarkButton
                      id={cedarSystem.id}
                      isBookmarked={cedarSystem.isBookmarked}
                    />
                  </div>
                </div>

                <PageHeading className="margin-top-1 margin-bottom-0 line-height-heading-2">
                  {cedarSystem.name}
                  <span className="margin-left-05 text-normal font-body-lg">
                    ({cedarSystem.acronym})
                  </span>
                </PageHeading>

                {/* Display TLC Phase */}
                <div className="display-flex">
                  <p className="text-bold margin-right-2">
                    {t('singleSystem.summary.tlcPhase')}
                  </p>
                  <TLCTag
                    tlcPhase={data?.cedarAuthorityToOperate[0]?.tlcPhase}
                  />
                </div>

                {flags.systemWorkspace &&
                  systemProfileData.cedarSystemDetails?.isMySystem && (
                    <div className="margin-top-2 margin-bottom-05">
                      <UswdsReactLink
                        className="text-no-underline"
                        to={`/systems/${systemId}/workspace`}
                      >
                        <span className="text-underline">
                          {t('singleSystem.summary.goToWorkspace')}
                        </span>
                        <span aria-hidden>&nbsp;</span>
                        <span aria-hidden>&rarr; </span>
                      </UswdsReactLink>
                    </div>
                  )}

                <div className="text-normal font-body-md">
                  <CollapsableLink
                    className="margin-top-3"
                    eyeIcon
                    startOpen
                    labelPosition="bottom"
                    closeLabel={t('singleSystem.summary.hide')}
                    styleLeftBar={false}
                    id={t('singleSystem.id')}
                    label={t('singleSystem.summary.expand')}
                    bold={false}
                  >
                    <div
                      className={classnames(
                        'description-truncated',
                        'margin-bottom-2',
                        {
                          expanded: descriptionExpanded
                        }
                      )}
                    >
                      {cedarSystem.description ? (
                        <>
                          <DescriptionDefinition
                            definition={cedarSystem.description}
                            ref={descriptionRef}
                            className="font-body-lg line-height-body-5 text-light"
                          />
                          {isDescriptionExpandable && (
                            <div>
                              <Button
                                unstyled
                                type="button"
                                className="margin-top-1"
                                onClick={() => {
                                  setDescriptionExpanded(!descriptionExpanded);
                                }}
                              >
                                {t(
                                  descriptionExpanded
                                    ? 'singleSystem.description.less'
                                    : 'singleSystem.description.more'
                                )}
                                <Icon.ExpandMore
                                  aria-hidden
                                  className="expand-icon margin-left-05 margin-bottom-2px text-tbottom"
                                />
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="font-heading-lg line-height-heading-2 text-italic text-base-dark">
                          {t('singleSystem.noDescription')}
                        </div>
                      )}
                    </div>
                    {productionLocation && productionLocation.address && (
                      <Link
                        aria-label={t('singleSystem.summary.label')}
                        className="line-height-body-5"
                        href={productionLocation.address}
                        variant="external"
                        target="_blank"
                      >
                        {t('singleSystem.summary.view')} {cedarSystem.name}
                        <span aria-hidden>&nbsp;</span>
                      </Link>
                    )}
                    <Grid row className="margin-top-4">
                      {/* CMS component owner */}
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          className="font-body-xs line-height-body-2"
                          definition={t('singleSystem.summary.subheader1')}
                        />
                        <DescriptionTerm
                          className="font-heading-lg line-height-heading-2"
                          term={showSystemVal(cmsComponent, {
                            defaultClassName:
                              'text-normal text-italic text-base-dark'
                          })}
                        />
                      </Grid>
                      {/* Business Owner */}
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          className="font-body-xs line-height-body-2"
                          definition={t('singleSystem.summary.subheader2', {
                            count: businessOwners?.length || 0
                          })}
                        />
                        <DescriptionTerm
                          className="font-heading-lg line-height-heading-2"
                          term={
                            businessOwners?.length
                              ? businessOwners
                                  ?.map(bo => getPersonFullName(bo))
                                  .join(', ')
                              : showSystemVal(null, {
                                  defaultClassName:
                                    'text-normal text-italic text-base-dark'
                                })
                          }
                        />
                      </Grid>
                      {/* Go live date */}
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          className="font-body-xs line-height-body-2"
                          definition={t('singleSystem.summary.subheader3')}
                        />
                        <DescriptionTerm
                          className="font-heading-lg line-height-heading-2"
                          term={showSystemVal(null, {
                            defaultClassName:
                              'text-normal text-italic text-base-dark'
                          })}
                        />
                      </Grid>
                      {/* Most recent major change */}
                      <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                        <DescriptionDefinition
                          className="font-body-xs line-height-body-2"
                          definition={t('singleSystem.summary.subheader4')}
                        />
                        <DescriptionTerm
                          className="font-heading-lg line-height-heading-2"
                          term={showSystemVal(null, {
                            defaultClassName:
                              'text-normal text-italic text-base-dark'
                          })}
                        />
                      </Grid>
                    </Grid>
                  </CollapsableLink>
                </div>
              </Grid>
            </div>
          </SummaryBoxContent>
        </SummaryBox>

        {isMobile && (
          <SystemSubNav
            subinfo={subpageKey}
            system={systemProfileData}
            systemProfileHiddenFields={flags.systemProfileHiddenFields}
            modal={modal}
            setModalSubpage={setModalSubpage}
          />
        )}

        {subinfo !== 'team' && (
          <GridContainer className="margin-bottom-3 margin-top-2">
            <Alert
              type="info"
              isClosable
              heading={t('singleSystem.editPage.tempEditBanner.heading')}
            >
              <Trans i18nKey="systemProfile:singleSystem.editPage.tempEditBanner.content">
                indexOne
                <Link href="mailto:EnterpriseArchitecture@cms.hhs.gov">
                  email
                </Link>
                indexTwo
              </Trans>
            </Alert>
          </GridContainer>
        )}

        <SectionWrapper className="margin-bottom-5">
          <GridContainer className={classnames({ 'maxw-none': modal })}>
            <Grid row gap>
              {!isMobile && (
                <Grid
                  desktop={{ col: 3 }}
                  className="padding-right-4 sticky side-nav"
                >
                  {/* Side navigation for single system */}
                  <SideNav items={subNavigationLinks} />

                  {/* Setting a ref here to reference the grid width for the fixed side nav */}
                  {modal && (
                    <>
                      <div className="top-divider margin-top-4" />
                      <PointsOfContactSidebar
                        subpageKey={subpageKey}
                        system={systemProfileData}
                        systemId={systemId}
                      />
                    </>
                  )}
                </Grid>
              )}

              <Grid desktop={{ col: 9 }}>
                {subComponent ? (
                  <div
                    id={subComponent.componentId ?? ''}
                    className="scroll-margin-top-5"
                  >
                    <GridContainer className="padding-left-0 padding-right-0">
                      <Grid row gap>
                        {/* Central component */}
                        <Grid
                          desktop={{ col: modal ? 12 : 8 }}
                          className="padding-top-3"
                        >
                          {subComponent.component}
                        </Grid>

                        {/* Contact info sidebar */}
                        {!modal && (
                          <Grid
                            desktop={{ col: 4 }}
                            className={classnames({
                              'sticky side-nav padding-top-7': !isMobile,
                              'margin-top-3': isMobile
                            })}
                          >
                            {/* Setting a ref here to reference the grid width for the fixed side nav */}
                            <div className="side-divider">
                              <div className="top-divider" />
                              <PointsOfContactSidebar
                                subpageKey={subpageKey}
                                system={systemProfileData}
                                systemId={systemId}
                              />
                            </div>
                          </Grid>
                        )}
                      </Grid>
                    </GridContainer>
                  </div>
                ) : (
                  <NotFoundPartial />
                )}
              </Grid>
            </Grid>
          </GridContainer>
        </SectionWrapper>
      </div>
    </MainContent>
  );
};

export default SystemProfile;
