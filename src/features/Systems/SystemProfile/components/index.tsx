import React from 'react';
import i18next from 'i18next';

import { SystemProfileData } from 'types/systemProfile';

import ATO from './ATO';
import Contracts from './Contracts';
import FundingAndBudget from './FundingAndBudget';
import SubSystems from './SubSystems';
import SystemData from './SystemData';
import SystemDetails from './SystemDetails';
import SystemHome from './SystemHome';
import Team from './Team';
import ToolsAndSoftware from './ToolsAndSoftware';

type sideNavItemProps = {
  groupEnd?: boolean; // Value used to designate end of sidenav subgrouping / border-bottom
  component: React.ReactNode;
  route: string;
  componentId?: string;
  hashLinks?: { name: string; hash: string }[];
};

interface sideNavProps {
  [key: string]: sideNavItemProps;
}

// groupEnd value is used to designate the end of navigation related grouping

const sideNavItems = (
  system: SystemProfileData,
  systemProfileHiddenFields: boolean
): sideNavProps => {
  return {
    home: {
      groupEnd: true,
      component: <SystemHome system={system} />,
      route: `/systems/${system.id}/home`,
      // Use styles from ./SystemDetails/index.scss#system-detail
      componentId: 'system-detail'
    },
    details: {
      component: <SystemDetails system={system} />,
      route: `/systems/${system.id}/details`,
      componentId: 'system-detail',
      hashLinks: [
        {
          name: i18next.t<string>('systemProfile:navigation.detailsBasic'),
          hash: '#basic'
        },
        {
          name: i18next.t<string>('systemProfile:navigation.detailsUrls'),
          hash: '#urls'
        },
        {
          name: i18next.t<string>('systemProfile:navigation.detailsDev'),
          hash: '#development'
        },
        {
          name: i18next.t<string>('systemProfile:navigation.detailsIp'),
          hash: '#ip'
        }
      ]
    },
    'system-data': {
      component: <SystemData system={system} />,
      route: `/systems/${system.id}/system-data`,
      componentId: 'system-data',
      hashLinks: [
        {
          name: i18next.t<string>(
            'systemProfile:singleSystem.systemData.header'
          ),
          hash: '#system'
        },
        {
          name: i18next.t<string>(
            'systemProfile:singleSystem.systemData.apiInfo'
          ),
          hash: '#api'
        },
        {
          name: i18next.t<string>(
            'systemProfile:singleSystem.systemData.dataExchanges'
          ),
          hash: '#exchanges'
        }
        /* {
          name: 'Records management',
          hash: '#records'
        } */
      ]
    },
    'tools-and-software': {
      component: <ToolsAndSoftware system={system} />,
      route: `/systems/${system.id}/tools-and-software`,
      componentId: 'system-section-508'
    },
    'sub-systems': {
      groupEnd: true,
      component: <SubSystems system={system} />,
      route: `/systems/${system.id}/sub-systems`,
      componentId: 'system-sub-systems'
    },
    team: {
      component: <Team system={system} />,
      route: `/systems/${system.id}/team`,
      componentId: 'system-team',
      hashLinks: [
        {
          name: i18next.t<string>('systemProfile:navigation.teamFte'),
          hash: '#fte'
        },
        {
          name: i18next.t<string>(
            'systemProfile:navigation.teamBusinessOwners'
          ),
          hash: '#businessOwners'
        },
        {
          name: i18next.t<string>('systemProfile:navigation.teamProjectLeads'),
          hash: '#projectLeads'
        },
        {
          name: i18next.t<string>('systemProfile:navigation.teamAdditional'),
          hash: '#additional'
        }
      ]
    },
    contracts: {
      component: <Contracts system={system} />,
      route: `/systems/${system.id}/contracts`,
      componentId: 'contracts'
    },
    'funding-and-budget': {
      component: <FundingAndBudget system={system} />,
      route: `/systems/${system.id}/funding-and-budget`,
      componentId: 'funding-and-budget',
      groupEnd: true
    },
    'ato-and-security': {
      component: <ATO system={system} />,
      route: `/systems/${system.id}/ato-and-security`,
      componentId: 'ato-and-security',
      hashLinks: [
        {
          name: i18next.t<string>('systemProfile:navigation.ato'),
          hash: '#ato'
        },
        {
          name: i18next.t<string>(
            'systemProfile:navigation.atoPoamsAndFindings'
          ),
          hash: '#poamsAndFindings'
        },
        {
          name: i18next.t<string>(
            'systemProfile:navigation.atoDatesFormsAndTesting'
          ),
          hash: '#datesFormsAndTesting'
        }
      ]
    },
    ...(!systemProfileHiddenFields && {
      'lifecycle-id': {
        component: <SystemHome system={system} />,
        route: `/systems/${system.id}/lifecycle-id`
      },
      documents: {
        component: <SystemHome system={system} />,
        route: `/systems/${system.id}/documents`
      }
    })
  };
};

export default sideNavItems;
