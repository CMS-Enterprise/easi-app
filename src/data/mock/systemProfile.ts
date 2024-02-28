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
        __typename: 'CedarSystemMaintainerInformation'
      },
      __typename: 'CedarSystemDetails'
    }
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
