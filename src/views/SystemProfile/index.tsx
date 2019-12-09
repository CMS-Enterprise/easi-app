import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from 'components/Header';

const mockSystems: any[] = [
  { id: '1', name: 'System1', slug: 'system1', link: '/system/system1' },
  { id: '2', name: 'System2', slug: 'system2', link: '/system/system2' },
  { id: '3', name: 'System3', slug: 'system3', link: '/system/system3' },
  { id: '4', name: 'System4', slug: 'system4', link: '/system/system4' },
  { id: '5', name: 'System5', slug: 'system5', link: '/system/system5' }
];

type SystemProfileProps = {
  match: any;
};

const SystemProfile = ({ match }: SystemProfileProps) => {
  return (
    <div className="system-profile">
      <Header
        secondaryNavList={mockSystems}
        activeNavListItem={match.params.profileId}
      />
      <h1>System Profile</h1>
    </div>
  );
};

export default withRouter(SystemProfile);
