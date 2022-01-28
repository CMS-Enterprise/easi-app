import React from 'react';

import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';

import SystemHome from './SystemHome';

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
    route: `/system-profile/${system.id}/home`
  },
  details: {
    component: <SystemHome system={system} />,
    route: `/system-profile/${system.id}/details`
  },
  'team-and-contract': {
    component: <SystemHome system={system} />,
    route: `/system-profile/${system.id}/team-and-contract`
  },
  'funding-and-budget': {
    component: <SystemHome system={system} />,
    route: `/system-profile/${system.id}/funding-and-budget`
  },
  'tools-and-software': {
    groupEnd: true,
    component: <SystemHome system={system} />,
    route: `/system-profile/${system.id}/tools-and-software`
  },
  ato: {
    component: <SystemHome system={system} />,
    route: `/system-profile/${system.id}/ato`
  },
  'lifecycle-id': {
    component: <SystemHome system={system} />,
    route: `/system-profile/${system.id}/lifecycle-id`
  },
  'section-508': {
    groupEnd: true,
    component: <SystemHome system={system} />,
    route: `/system-profile/${system.id}/section-508`
  },
  'sub-systems': {
    component: <SystemHome system={system} />,
    route: `/system-profile/${system.id}/sub-systems`
  },
  'system-data': {
    component: <SystemHome system={system} />,
    route: `/system-profile/${system.id}/system-data`
  },
  documents: {
    component: <SystemHome system={system} />,
    route: `/system-profile/${system.id}/documents`
  }
});

export default sideNavItems;
