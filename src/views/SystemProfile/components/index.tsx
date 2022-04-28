import React from 'react';

import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';

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
};

interface sideNavProps {
  [key: string]: sideNavItemProps;
}

// groupEnd value is used to designate the end of navigation related grouping

const sideNavItems = (system: CedarSystemProps): sideNavProps => ({
  home: {
    groupEnd: true,
    component: <SystemHome system={system} />,
    route: `/systems/${system.id}/home`
  },
  details: {
    component: <SystemDetails system={system} />,
    route: `/systems/${system.id}/details`
  },
  'team-and-contract': {
    component: <TeamAndContract system={system} />,
    route: `/systems/${system.id}/team-and-contract`
  },
  'funding-and-budget': {
    component: <FundingAndBudget system={system} />,
    route: `/systems/${system.id}/funding-and-budget`
  },
  'tools-and-software': {
    groupEnd: true,
    component: <ToolsAndSoftware system={system} />,
    route: `/systems/${system.id}/tools-and-software`
  },
  ato: {
    component: <ATO system={system} />,
    route: `/systems/${system.id}/ato`
  },
  'lifecycle-id': {
    component: <SystemHome system={system} />,
    route: `/systems/${system.id}/lifecycle-id`
  },
  'section-508': {
    groupEnd: true,
    component: <Section508 system={system} />,
    route: `/systems/${system.id}/section-508`
  },
  'sub-systems': {
    component: <SubSystems system={system} />,
    route: `/systems/${system.id}/sub-systems`
  },
  'system-data': {
    component: <SystemData system={system} />,
    route: `/systems/${system.id}/system-data`
  },
  documents: {
    component: <SystemHome system={system} />,
    route: `/systems/${system.id}/documents`
  }
});

export default sideNavItems;
