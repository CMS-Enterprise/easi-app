import React from 'react';

import { SystemProfileData } from 'types/systemProfile';

import ATO from './ATO';
import Contracts from './Contracts';
import FundingAndBudget from './FundingAndBudget';
import Section508 from './Section508';
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
};

interface sideNavProps {
  [key: string]: sideNavItemProps;
}

// groupEnd value is used to designate the end of navigation related grouping

const sideNavItems = (
  system: SystemProfileData,
  systemProfileHiddenFields: boolean
): sideNavProps => {
  return !systemProfileHiddenFields
    ? {
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
          componentId: 'system-detail'
        },
        team: {
          groupEnd: true,
          component: <Team system={system} />,
          route: `/systems/${system.id}/team`,
          componentId: 'system-team'
        },
        ato: {
          component: <ATO system={system} />,
          route: `/systems/${system.id}/ato`,
          componentId: 'ato'
        },
        'tools-and-software': {
          groupEnd: true,
          component: <ToolsAndSoftware system={system} />,
          route: `/systems/${system.id}/tools-and-software`,
          componentId: 'system-section-508'
        }
      }
    : {
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
          componentId: 'system-detail'
        },
        team: {
          component: <Team system={system} />,
          route: `/systems/${system.id}/team`,
          componentId: 'system-team'
        },
        contracts: {
          component: <Contracts system={system} />,
          route: `/systems/${system.id}/contracts`,
          componentId: 'contracts'
        },
        'funding-and-budget': {
          component: <FundingAndBudget system={system} />,
          route: `/systems/${system.id}/funding-and-budget`,
          componentId: 'funding-and-budget'
        },
        ato: {
          component: <ATO system={system} />,
          route: `/systems/${system.id}/ato`,
          componentId: 'ato'
        },
        'lifecycle-id': {
          component: <SystemHome system={system} />,
          route: `/systems/${system.id}/lifecycle-id`
        },
        'section-508': {
          groupEnd: true,
          component: <Section508 system={system} />,
          route: `/systems/${system.id}/section-508`,
          componentId: 'system-section-508'
        },
        'sub-systems': {
          component: <SubSystems system={system} />,
          route: `/systems/${system.id}/sub-systems`,
          componentId: 'system-sub-systems'
        },
        'system-data': {
          component: <SystemData system={system} />,
          route: `/systems/${system.id}/system-data`,
          componentId: 'system-data'
        },
        documents: {
          component: <SystemHome system={system} />,
          route: `/systems/${system.id}/documents`
        }
      };
};

export default sideNavItems;
