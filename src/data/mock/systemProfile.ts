import { cloneDeep } from 'lodash';

import GetSystemProfileQuery from 'queries/GetSystemProfileQuery';
import { CedarRole } from 'queries/types/CedarRole';
import {
  GetSystemProfile,
  // eslint-disable-next-line camelcase
  GetSystemProfile_cedarSystemDetails_roles,
  GetSystemProfileVariables
} from 'queries/types/GetSystemProfile';
import { CedarAssigneeType } from 'types/graphql-global-types';
import {
  CedarRoleAssigneePerson,
  SystemProfileData,
  UsernameWithRoles
} from 'types/systemProfile';
import { MockedQuery } from 'types/util';
import MockUsers from 'utils/testing/MockUsers';
import {
  getSystemProfileData,
  getUsernamesWithRoles
} from 'views/SystemProfile';

const emptyRoles: CedarRole[] = [
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-17-0',
    assigneeType: CedarAssigneeType.ORGANIZATION,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: '261-1497-0',
    assigneeOrgName: 'Web and Emerging Technologies Group',
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'Business Owner',
    roleID: '384-16116-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-28-0',
    assigneeType: CedarAssigneeType.ORGANIZATION,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: '261-1497-0',
    assigneeOrgName: 'Web and Emerging Technologies Group',
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'System Maintainer',
    roleID: '384-16406-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-17-0',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'Business Owner',
    roleID: '384-16670-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-29-0',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'ISSO',
    roleID: '384-17151-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-32-0',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'Project Lead',
    roleID: '384-17330-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-53-0',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'Survey Point of Contact',
    roleID: '384-17633-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-51-0',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'System Business Question Contact',
    roleID: '384-17820-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-52-0',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'System Data Center Contact',
    roleID: '384-18231-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-50-0',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'System Issues Contact',
    roleID: '384-18509-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-50-0',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'System Issues Contact',
    roleID: '384-18665-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-28-0',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'System Maintainer',
    roleID: '384-18958-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-35-0',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: "Contracting Officer's Representative (COR)",
    roleID: '384-19359-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-55-0',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'QA Reviewer',
    roleID: '384-19403-0',
    __typename: 'CedarRole'
  },
  {
    application: 'alfabet',
    objectID: '000-0000-0',
    roleTypeID: '238-56-0',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: 'DA Reviewer',
    roleID: '384-20087-0',
    __typename: 'CedarRole'
  }
];

const mockUsers = new MockUsers();
const users = [...mockUsers.splice(0, 4)];
export const roles: CedarRole[] = emptyRoles.map((role, index) => {
  if (role.assigneeType === CedarAssigneeType.ORGANIZATION) return role;

  const userIndex = index % users.length;
  const { userInfo } = users[userIndex];
  const [assigneeFirstName, assigneeLastName] = userInfo.commonName.split(' ');

  return {
    ...role,
    assigneeUsername: userInfo.euaUserId,
    assigneeEmail: userInfo.email,
    assigneeFirstName,
    assigneeLastName
  };
});

export const usernamesWithRoles: UsernameWithRoles[] = getUsernamesWithRoles(
  roles.filter(
    ({ assigneeType }) => assigneeType === CedarAssigneeType.PERSON
  ) as CedarRoleAssigneePerson[]
);

export const result: { data: GetSystemProfile } = {
  data: {
    cedarAuthorityToOperate: [
      {
        uuid: '00000000-0000-0000-0000-000000000000',
        tlcPhase: 'Operate',
        dateAuthorizationMemoExpires: '2022-07-30T00:00:00Z',
        countOfOpenPoams: 7,
        lastAssessmentDate: '2021-11-15T00:00:00Z',
        __typename: 'CedarAuthorityToOperate'
      }
    ],
    cedarBudget: [
      {
        fiscalYear: '2023',
        funding:
          'Most of this funding is directly and only for this system (over 80%)',
        fundingId: '12345',
        fundingSource: 'Prog Ops',
        id: '12345',
        name: 'Budget Project 1',
        projectId: '12345',
        projectTitle: 'Budget X',
        systemId: '12345',
        __typename: 'CedarBudget'
      },
      {
        fiscalYear: '2023',
        funding:
          'Only part of this funding is directly for this system (less than 40%)',
        fundingId: '12345',
        fundingSource: 'Fed Admin',
        id: '12345',
        name: 'Budget Project 1',
        projectId: '12345',
        projectTitle: 'Budget X',
        systemId: '12345',
        __typename: 'CedarBudget'
      }
    ],
    cedarBudgetSystemCost: {
      budgetActualCost: [
        {
          actualSystemCost: '3.50',
          fiscalYear: '2021',
          systemId: '1234',
          __typename: 'CedarBudgetActualCost'
        },
        {
          actualSystemCost: '7',
          fiscalYear: '2022',
          systemId: '1235',
          __typename: 'CedarBudgetActualCost'
        },
        {
          actualSystemCost: '10.50',
          fiscalYear: '2023',
          systemId: '1236',
          __typename: 'CedarBudgetActualCost'
        },
        {
          actualSystemCost: '14',
          fiscalYear: '2024',
          systemId: '1237',
          __typename: 'CedarBudgetActualCost'
        }
      ],
      __typename: 'CedarBudgetSystemCost'
    },
    cedarThreat: [
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'High',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Moderate',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      },
      {
        weaknessRiskLevel: 'Low',
        __typename: 'CedarThreat'
      }
    ],
    cedarSoftwareProducts: {
      aiSolnCatg: ['AI Solution Categories'],
      apiDataArea: [
        'Beneficiary and Consumer',
        'Healthcare Payment',
        'Organization',
        'Supporting Resoruce'
      ],
      softwareProducts: [
        {
          apiGatewayUse: false,
          elaPurchase: 'ELA Purchase',
          elaVendorId: 'ELA Vendor ID 1',
          providesAiCapability: false,
          refstr: 'Ref String',
          softwareCatagoryConnectionGuid: 'Software Catagory Connection GUID 1',
          softwareVendorConnectionGuid: 'Software Vendor Connection GUID 1',
          softwareCost: 'about $3.50',
          softwareElaOrganization: 'ELA Organization',
          softwareName: 'SQL Server',
          systemSoftwareConnectionGuid: 'System Software Connection GUID 1',
          technopediaCategory: 'Tecnhopedia Category 1',
          technopediaID: 'Technopedia ID 1',
          vendorName: 'Microsoft',
          __typename: 'CedarSoftwareProductItem'
        },
        {
          apiGatewayUse: true,
          elaPurchase: 'ELA Purchase',
          elaVendorId: 'ELA Vendor ID 2',
          providesAiCapability: false,
          refstr: 'Ref String',
          softwareCatagoryConnectionGuid: 'Software Catagory Connection GUID 2',
          softwareVendorConnectionGuid: 'Software Vendor Connection GUID 2',
          softwareCost: 'about $3.50',
          softwareElaOrganization: 'ELA Organization',
          softwareName: 'Splunk',
          systemSoftwareConnectionGuid: 'System Software Connection GUID 2',
          technopediaCategory: 'Tecnhopedia Category 2',
          technopediaID: 'Technopedia ID 2',
          vendorName: 'Splunk',
          __typename: 'CedarSoftwareProductItem'
        },
        {
          apiGatewayUse: true,
          elaPurchase: 'ELA Purchase',
          elaVendorId: 'ELA Vendor ID 3',
          providesAiCapability: true,
          refstr: 'Ref String',
          softwareCatagoryConnectionGuid: 'Software Catagory Connection GUID 3',
          softwareVendorConnectionGuid: 'Software Vendor Connection GUID 3',
          softwareCost: 'about $3.50',
          softwareElaOrganization: 'ELA Organization',
          softwareName: 'Terraform',
          systemSoftwareConnectionGuid: 'System Software Connection GUID 3',
          technopediaCategory: 'Tecnhopedia Category 3',
          technopediaID: 'Technopedia ID 3',
          vendorName: 'hashiCorp',
          __typename: 'CedarSoftwareProductItem'
        }
      ],
      aiSolnCatgOther: null,
      apiDescPubLocation: 'API Publishing Location',
      apiDescPublished: 'No, published elsewhere',
      apiFHIRUse: 'Hl7',
      apiFHIRUseOther: null,
      apiHasPortal: true,
      apisAccessibility: 'Internal Access',
      apisDeveloped: 'API in development but not yet launched',
      developmentStage: 'O&M',
      systemHasAPIGateway: true,
      usesAiTech:
        'Plans (No - But there currently are plans to use AI capabilities in the next two years)',
      __typename: 'CedarSoftwareProducts'
    },
    cedarSystemDetails: {
      businessOwnerInformation: {
        isCmsOwned: true,
        numberOfContractorFte: '20',
        numberOfFederalFte: '4',
        numberOfSupportedUsersPerMonth: '2750000',
        __typename: 'CedarBusinessOwnerInformation'
      },
      cedarSystem: {
        id: '000-100-0',
        name: 'CMS.gov',
        description:
          'CMS.gov provides the public and professionals the ability to access information regarding the CMS programs. CMS.gov website mission is to provide clear, accurate, and timely information about CMS programs to the entire health care community to improve quality and efficiency in an evolving health care system. CMS.gov website is a combination of static content and general content applications.  Core Function: * Information dissemination',
        acronym: 'cms.hhs.gov',
        status: 'Approved',
        businessOwnerOrg: 'Web and Emerging Technologies Group',
        businessOwnerOrgComp: 'OC',
        systemMaintainerOrg: 'Web and Emerging Technologies Group',
        systemMaintainerOrgComp: 'OC',
        __typename: 'CedarSystem'
      },
      deployments: [
        {
          id: '000-0000-1',
          startDate: '2020-11-11T00:00:00Z',
          dataCenter: {
            name: 'AWS US East/West',
            __typename: 'CedarDataCenter'
          },
          deploymentType: 'COOP DR',
          name: 'CMS.gov v.22 COOP DR',
          __typename: 'CedarDeployment'
        },
        {
          id: '000-0000-2',
          startDate: '2023-10-01T00:00:00Z',
          dataCenter: {
            name: 'AWS US East/West',
            __typename: 'CedarDataCenter'
          },
          deploymentType: 'Development',
          name: 'CMS.gov v.22 Development',
          __typename: 'CedarDeployment'
        },
        {
          id: '000-0000-3',
          startDate: '2023-01-01T00:00:00Z',
          dataCenter: {
            name: 'AWS US East/West',
            __typename: 'CedarDataCenter'
          },
          deploymentType: 'Production',
          name: 'CMS.gov v.22 Production',
          __typename: 'CedarDeployment'
        },
        {
          id: '000-0000-4',
          startDate: '2022-07-30T00:00:00Z',
          dataCenter: {
            name: 'AWS US East/West',
            __typename: 'CedarDataCenter'
          },
          deploymentType: 'Testing',
          name: 'CMS.gov v.22 Testing',
          __typename: 'CedarDeployment'
        },
        {
          id: '000-0000-5',
          startDate: null,
          dataCenter: {
            name: 'AWS US East/West',
            __typename: 'CedarDataCenter'
          },
          deploymentType: 'Implementation',
          name: 'CMS.gov v.22 Implementation',
          __typename: 'CedarDeployment'
        }
      ],
      roles,
      urls: [
        {
          id: '000-0000-1',
          address: 'https://cms.gov',
          isAPIEndpoint: false,
          isBehindWebApplicationFirewall: true,
          isVersionCodeRepository: false,
          urlHostingEnv: 'Production',
          __typename: 'CedarURL'
        }
      ],
      systemMaintainerInformation: {
        agileUsed: true,
        deploymentFrequency: 'Bi-weekly',
        devCompletionPercent: '75% - 99%',
        devWorkDescription:
          'Continued enhancements and improvements and alignment with legislative changes.  Also, working on an upcoming redesign effort for the website.',
        netAccessibility:
          'Accessible to both public internet and to CMS-internal network',
        ecapParticipation: true,
        frontendAccessType: 'IPv4 only',
        ipEnabledAssetCount: 21,
        ip6TransitionPlan: 'This system will be transitioned to IPv6',
        ip6EnabledAssetPercent: '25%',
        hardCodedIPAddress: true,
        quarterToRetireReplace: '1',
        systemCustomization: '50% customization',
        yearToRetireReplace: '2030',
        plansToRetireReplace: 'Yes - Retire and Replace',
        __typename: 'CedarSystemMaintainerInformation'
      },
      __typename: 'CedarSystemDetails'
    },
    cedarContractsBySystem: [
      {
        id: '{BC2C09FA-63CD-46e5-99EB-D27DB538FD6A}',
        startDate: null,
        endDate: null,
        contractNumber: 'GS35F372DA',
        contractName:
          'Centers for Medicare and Medicaid Services Analysis, Reporting and Tracking System (CMS ARTS)',
        description: null,
        orderNumber: '75FCMC21F0028',
        serviceProvided: null,
        isDeliveryOrg: true,
        __typename: 'CedarContract'
      }
    ],
    cedarSubSystems: [
      {
        id: '{11AB1A00-1234-5678-ABC1-1A001B00CC0A}',
        name: 'Centers for Management Services',
        acronym: 'CMS',
        description:
          'Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.',
        __typename: 'CedarSubSystem'
      },
      {
        id: '{11AB1A00-1234-5678-ABC1-1A001B00CC1B}',
        name: 'Office of Funny Walks',
        acronym: 'OFW',
        description:
          'Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.',
        __typename: 'CedarSubSystem'
      }
    ]
  }
};

export const query: MockedQuery<GetSystemProfile, GetSystemProfileVariables> = {
  request: {
    query: GetSystemProfileQuery,
    variables: {
      cedarSystemId: '000-100-0'
    }
  },
  result
};

export function getMockSystemProfileData(
  data?: GetSystemProfile
): SystemProfileData {
  return getSystemProfileData(data ?? cloneDeep(result.data))!;
}

export function getMockPersonRole(
  // eslint-disable-next-line camelcase
  data?: Partial<GetSystemProfile_cedarSystemDetails_roles>
  // eslint-disable-next-line camelcase
): GetSystemProfile_cedarSystemDetails_roles {
  return {
    application: 'alfabet',
    objectID: '',
    roleTypeID: '',
    assigneeType: CedarAssigneeType.PERSON,
    assigneeUsername: null,
    assigneeEmail: null,
    assigneeOrgID: null,
    assigneeOrgName: null,
    assigneeFirstName: null,
    assigneeLastName: null,
    roleTypeName: '',
    roleID: null,
    __typename: 'CedarRole',
    ...data
  };
}
