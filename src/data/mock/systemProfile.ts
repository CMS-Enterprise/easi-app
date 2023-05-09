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
import { SystemProfileData } from 'types/systemProfile';
import { MockedQuery } from 'types/util';
import MockUsers from 'utils/testing/MockUsers';
import { getSystemProfileData } from 'views/SystemProfile';

const mockUsers = new MockUsers();

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

export const roles: CedarRole[] = emptyRoles.map(user => {
  if (user.assigneeType === CedarAssigneeType.ORGANIZATION) {
    return user;
  }
  const userInfo = mockUsers.next()?.userInfo!;
  const [assigneeFirstName, assigneeLastName] = userInfo.commonName.split(' ');

  return {
    ...user,
    assigneeFirstName,
    assigneeLastName,
    assigneeUsername: userInfo.euaUserId,
    assigneeEmail: userInfo.email
  };
});

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
    roleTypeName: null,
    roleID: null,
    __typename: 'CedarRole',
    ...data
  };
}
