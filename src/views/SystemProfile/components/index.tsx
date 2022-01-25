import React from 'react';

import SystemHome from './systemHome';

type sideNavItemProps = {
  groupEnd?: boolean; // Value used to designate end of sidenav subgrouping / border-bottom
  component: React.ReactNode;
  route: string;
};

interface sideNavProps {
  [key: string]: sideNavItemProps;
}

const sideNavItems = (id: string): sideNavProps => ({
  home: {
    groupEnd: true,
    component: <SystemHome />,
    route: `/system-profile/${id}/home`
  },
  details: {
    component: <SystemHome />,
    route: `/system-profile/${id}/details`
  },
  'team-and-contract': {
    component: <SystemHome />,
    route: `/system-profile/${id}/team-and-contract`
  },
  'funding-and-budget': {
    component: <SystemHome />,
    route: `/system-profile/${id}/funding-and-budget`
  },
  'tools-and-software': {
    groupEnd: true,
    component: <SystemHome />,
    route: `/system-profile/${id}/tools-and-software`
  },
  ato: {
    component: <SystemHome />,
    route: `/system-profile/${id}/ato`
  },
  'lifecycle-id': {
    component: <SystemHome />,
    route: `/system-profile/${id}/lifecycle-id`
  },
  'section-508': {
    groupEnd: true,
    component: <SystemHome />,
    route: `/system-profile/${id}/section-508`
  },
  'sub-systems': {
    component: <SystemHome />,
    route: `/system-profile/${id}/sub-systems`
  },
  'system-data': {
    component: <SystemHome />,
    route: `/system-profile/${id}/system-data`
  },
  documents: {
    component: <SystemHome />,
    route: `/system-profile/${id}/documents`
  }
});

export default sideNavItems;
