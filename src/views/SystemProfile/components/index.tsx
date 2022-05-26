import React from 'react';

import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';
import { tempCedarSystemProps } from 'views/Sandbox/mockSystemData';

import ATO from './ATO';
import FundingAndBudget from './FundingAndBudget';
import Section508 from './Section508';
import SubSystems from './SubSystems';
import SystemData from './SystemData';
import SystemDetails from './SystemDetails';
import SystemHome from './SystemHome';
import TeamAndContract from './TeamAndContract';
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

export type SystemProfileSubComponentProps = {
  system: tempCedarSystemProps;
  componentId?: string;
};

// groupEnd value is used to designate the end of navigation related grouping

const sideNavItems = (
  system: CedarSystemProps,
  systemProfileHiddenFields: boolean
): sideNavProps => {
  // return !systemProfileHiddenFields
  return systemProfileHiddenFields
    ? {
        home: {
          groupEnd: true,
          component: <SystemHome system={system} />,
          route: `/systems/${system.id}/home`,
          componentId: 'system-detail'
        },
        details: {
          component: <SystemDetails system={system} />,
          route: `/systems/${system.id}/details`,
          componentId: 'system-detail'
        },
        'team-and-contract': {
          groupEnd: true,
          component: <TeamAndContract system={system} />,
          route: `/systems/${system.id}/team-and-contract`,
          componentId: 'system-system-team-and-contract'
        },
        ato: {
          component: <ATO system={system} />,
          route: `/systems/${system.id}/ato`,
          componentId: 'ato'
        },
        'section-508': {
          component: <Section508 system={system} />,
          route: `/systems/${system.id}/section-508`,
          componentId: 'system-section-508'
        }
      }
    : {
        home: {
          groupEnd: true,
          component: <SystemHome system={system} />,
          route: `/systems/${system.id}/home`,
          componentId: 'system-detail'
        },
        details: {
          component: <SystemDetails system={system} />,
          route: `/systems/${system.id}/details`,
          componentId: 'system-detail'
        },
        'team-and-contract': {
          component: <TeamAndContract system={system} />,
          route: `/systems/${system.id}/team-and-contract`,
          componentId: 'system-system-team-and-contract'
        },
        'funding-and-budget': {
          component: <FundingAndBudget system={system} />,
          route: `/systems/${system.id}/funding-and-budget`,
          componentId: 'funding-and-budget'
        },
        'tools-and-software': {
          groupEnd: true,
          component: <ToolsAndSoftware system={system} />,
          route: `/systems/${system.id}/tools-and-software`,
          componentId: 'system-section-508'
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
