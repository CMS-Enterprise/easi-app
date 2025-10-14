import React from 'react';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import SystemProfileFormWrapper from '../_components/SystemProfileFormWrapper';

const Team = () => {
  return (
    <SystemProfileFormWrapper section={SystemProfileLockableSection.TEAM}>
      team fields here
    </SystemProfileFormWrapper>
  );
};

export default Team;
