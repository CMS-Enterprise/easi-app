import React from 'react';

import SystemHome from './systemHome';

const sideNavItems = (id: string) => [
  {
    label: 'home',
    component: <SystemHome />,
    route: `/system-profile/${id}`
  },
  {
    label: 'details',
    component: <SystemHome />,
    route: `/system-profile/${id}/details`
  },
  {
    label: 'team-and-contract',
    component: <SystemHome />,
    route: `/system-profile/${id}/team-and-contract`
  },
  {
    label: 'funding-and-budget',
    component: <SystemHome />,
    route: `/system-profile/${id}/funding-and-budget`
  },
  {
    label: 'tools-and-software',
    component: <SystemHome />,
    route: `/system-profile/${id}/tools-and-software`
  },
  {
    label: 'ato',
    component: <SystemHome />,
    route: `/system-profile/${id}/ato`
  },
  {
    label: 'lifecycle-id',
    component: <SystemHome />,
    route: `/system-profile/${id}/lifecycle-id`
  },
  {
    label: 'section-508',
    component: <SystemHome />,
    route: `/system-profile/${id}/section-508`
  },
  {
    label: 'sub-systems',
    component: <SystemHome />,
    route: `/system-profile/${id}/sub-systems`
  },
  {
    label: 'system-data',
    component: <SystemHome />,
    route: `/system-profile/${id}/system-data`
  },
  {
    label: 'documents',
    component: <SystemHome />,
    route: `/system-profile/${id}/documents`
  }
];

export default sideNavItems;
